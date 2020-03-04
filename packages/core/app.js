const asts = require('./asts')
const compilers = require('./compilers')
const utils = require('./utils')
const helpers = require('./helpers')
const enums = require('./config/enums')

module.exports = class ReactToReactNative {
  constructor() {
    this.enums = enums /* 枚举字段 */

    /* 收集的组件信息合集 */
    this.collections = {
      exports: {}, /* 暴露出的组件名 */
      importReactPath: {}, /* 组件引用的react AST Path */
    }
    this.entryPath = '' /* 输入react组件绝对路径 */
    this.exportPath = '' /* 输出react-native组件绝对路径 */
    this.reactCompString = '' /* 输入react组件字符串 */
    this.cssString = '' /* 输入css字符串 */
    this.addCssString = (mark, cssString) => this.cssString += `\n/* ${mark}*/\n` + cssString
    this.cssType = '' /* scss | other */

    this.graph = {} /* 组件图信息 */
    this.currentCompilePath = '' /* 当前正在编译的组件路径 */
    this.afterTsCompiled = '' /* typescript编译后 */
    // this.afterCssCompiled = '' /* css编译器编译后） */
    // this.afterCssToObject = {} /* css-to-object后的css对象 */
    this.pureHtmlString = '' /* 组件合集的html string */
    // this.injectBrowserScript = '' /* 注入浏览器的script */
    this.externalToInlineStyle = {} /* 外联转内联的样式 */
    this.mixinedStyleExceptInherit = {} /* 混合[外联、内联、标签自带]的样式结果 */
    this.inheritStyle = {} /* 继承而来的样式 */
    this.mixinedStyle = {} /* 混合所有样式的结果 */
    this.finalStyleObject = {} /* 通过react-to-react-native转换后的最终样式 */
    // this.initialAST = {} /* visitors遍历前最初的ast */
    this.afterProcessAST = {} /* processAST.visitors遍历后的ast */
    // this.afterPackageCode = '' /* package阶段后生成的组件code */

    this.uniqueNodeInfo = {} /* JSXElement节点的信息 */
    this.addUniqueNodeInfo = (k, nodeInfo) => this.uniqueNodeInfo[k] = nodeInfo

    this.fsRelations = {} /* 节点间关系 */
    this.addFsRelation = (k, v) => {
      const sons = this.fsRelations[k]
      if (!sons) {
        this.fsRelations[k] = []
      }
      this.fsRelations[k].push(v)
    }

    this.tagSelfStyle = {} /* JSXElement节点标签自带的样式, 如h1 */
    this.addTagSelfStyle = (uniqueId, style) => this.tagSelfStyle[uniqueId] = style
  
    this.usingRNComponentNames = [] /* 使用到的React Native组件 */
    this.addUsingRNComponentName = (componentName) => {
      if (!this.usingRNComponentNames.includes(componentName)) {
        this.usingRNComponentNames.push(componentName)
      }
    }
    this.initialInlineStyle = {} /* 组件最初的内联样式 */
    this.addInitialInlineStyle = (uniqueId, inlineStyle) => this.initialInlineStyle[uniqueId] = inlineStyle
  
    this.initAsts()
    this.initCompilers()
    this.initUtils()
    this.initHelpers()
  }

  initAsts() {
    asts.call(this)
  }

  initCompilers() {
    compilers.call(this)
  }

  initUtils() {
    utils.call(this)
  }

  initHelpers() {
    helpers.call(this)
  }

  init({
    entryPath = '',
    exportPath = '',
    reactCompString = '',
    cssString = '',
    cssType = 'scss' 
  } = {}) {
    if (!entryPath && !reactCompString) {
      // TODO: add 保存该错误，并在start时返回包含错误的数组
      this.error('expected the type of reactCompString is react component string!')
    }
    this.entryPath = entryPath
    this.exportPath = exportPath
    this.reactCompString = reactCompString
    // TODO: replace 对entryPath存在时的路径进行检查，当该文件路径不合法时this.error, 并保存该错误
    this.compileType = Boolean(entryPath) ? this.enums.MULTIPLE_FILE : this.enums.SINGLE_FILE
    this.cssString = cssString
    this.cssType = cssType

    // TODO: update 替换成更好的书写方式
    if (!process.env.COMPILE_ENV || process.env.COMPILE_ENV === 'node') {
      // TODO: remove 移除该判断，因为前文代码compileType时已经对reactComPath校验通过
      if (this.entryPath) {
        this.reactCompString = require('fs').readFileSync(this.entryPath, 'utf8')
      }
    }

    return this
  }

  async start() {
    if (!process.env.COMPILE_ENV || process.env.COMPILE_ENV === 'node') {
      this.outputDir = require('path').dirname(this.exportPath)
    }
    
    // 构建graph
    this.graph = this.createGraphHelper({
      compileType: this.compileType,
      entryPath: this.entryPath,
      exportPath: this.exportPath,
    })

    if (!process.env.COMPILE_ENV || process.env.COMPILE_ENV === 'node') {
      // 添加导出路径 importSource
      Object.entries(this.graph).forEach(([filePath, component]) => {
        if (!component.exportPath) {
          component.exportPath = require('path').resolve(this.outputDir, component.importSource)
        }
      })
    }
    
    // 收集所有cssObject
    this.cssObject = {
      externalStyle: {},
      stableClassNames: {},
    }
    for await (let filePath of Object.keys(this.graph)) {
      this.currentCompilePath = filePath
      const { code, fileType } = this.graph[filePath]
      if (fileType === 'css') {
        const afterCSSNextCompiled = await this.scssCompiler(code)
        const afterCSSToObj = await this.cssToObject(afterCSSNextCompiled)
        this.cssObject.externalStyle = Object.assign(
          this.cssObject.externalStyle, afterCSSToObj.externalStyle
        )
        this.cssObject.stableClassNames = Object.assign(
          this.cssObject.stableClassNames, afterCSSToObj.stableClassNames
        )
      }
    }

    // process
    for await (let filePath of Object.keys(this.graph)) {
      this.currentCompilePath = filePath
      const component = this.graph[filePath]
      const { code, ast, fileType, } = component
      if (fileType === 'react') {
        // typescript编译
        component.afterTsCompiled = await this.typescriptCompiler(code)
        // 添加文本标签wrapper、添加uniqueId
        component.afterProcessAST = this.processAST(ast)
        // 构建父子节点间关系
        this.astToRelationTreeHelper(component.afterProcessAST, filePath)
      }
    }

    // 生成htmlString
    this.pureHtmlString = this.generatePureHtmlString({
      fsRelations: this.fsRelations,
      uniqueNodeInfo: this.uniqueNodeInfo,
      isTag: (uniqueId) => uniqueId.slice(9).startsWith(this.enums.UNIQUE_ID),
      uniqueIdName: this.enums.HTML_UNIQUE_ID_ATTRNAME,
      activeAddTextMark: this.enums.ACTIVE_ADD_TEXT_MARK,
      collectExports: this.collections.exports,
      hashHelper: this.hashHelper,
      collections: this.collections,
    })

    // 转换标签、事件
    Object.entries(this.graph).forEach(([filePath, component]) => {
      this.currentCompilePath = filePath
      const {
        ast,
        fileType,
      } = component
      if (fileType === 'react') {
        this.convertTagReferenceHelper(ast, {
          addUsingComponent: (name) => {
            component.usingComponent = (component.usingComponent || [])
            if (!component.usingComponent.includes(name)) {
              component.usingComponent.push(name)
            }
          }
        })
      }
    })
    
    // 外联转对象
    this.externalToInlineStyle = this.convertExternalToInline({
      html: this.pureHtmlString,
      css: this.cssObject,
      uniqueIdName: this.enums.HTML_UNIQUE_ID_ATTRNAME,
      activeAddTextMark: this.enums.ACTIVE_ADD_TEXT_MARK,
    })

    // 混合所有样式（除继承样式）
    this.mixinedStyleExceptInherit = this.mixinStyleExceptInherit({
      external: this.externalToInlineStyle,
      inline: this.initialInlineStyle,
      self: this.tagSelfStyle,
      cssObject: this.cssObject,
    })

    // TODO: add 暂搁置继承样式的处理
    this.inheritStyle = {}

    // 混合继承样式和其他样式
    this.mixinedStyle = this.mixinInheritAndOther(this.mixinedStyleExceptInherit, this.inheritStyle)
    
    // 生成最终的对象style
    this.finalStyleObject = this.transformAllStyle(this.mixinedStyle)

    Object.entries(this.graph).forEach(([filePath, component]) => {
      this.currentCompilePath = filePath
      const {
        ast,
        fileType,
      } = component
      if (fileType === 'react') {
        this.packageAST(ast)
        component.result = this.astUtils.ast2code(ast)
      }
    })
    
    if (!process.env.COMPILE_ENV || process.env.COMPILE_ENV === 'node') {
      const fs = require('fs')

      // 写入最终dist文件
      Object.entries(this.graph).forEach(([filePath, info]) => {
        const {
          fileType,
          exportPath,
          result,
          usingComponent,
        } = info
        
        const finalResult = this.generateReactNativeComponent({
          fileType,
          code: result,
          usingComponent,
        })
        if (!process.env.COMPILE_ENV || process.env.COMPILE_ENV === 'node') {
          if (exportPath) {
            fs.writeFileSync(exportPath, finalResult, 'utf8')
            this.log(`输出到'${exportPath}' -> success`)
          }
        }
      })

      const stylesheetPath = this.outputDir + `/${this.enums.STYLESHEET_FILE_NAME}.js`
      const stylesheetContent = `export default ` + JSON.stringify(this.finalStyleObject, null, 2)
      fs.writeFileSync(stylesheetPath, stylesheetContent, 'utf8')
    }
  }
}
