const asts = require('./asts')
const compilers = require('./compilers')
const utils = require('./utils')
const helpers = require('./helpers')
const enums = require('./config/enums')
const constants = require('./config/constants')

module.exports = class ReactToReactNative {
  constructor() {
    this.enums = enums /* 枚举字段 */
    this.constants = constants /* 常量 */

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
    this.removedInvalidStyle= {} /* 已经移除无效样式的样式结果 */
    this.convertedStyleToRN = {} /* 通过react-to-react-native转换后的样式 */
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
  
    this.distTagName = {} /* uniqueId对应的输出标签名 */
    this.addDistTagName = (uniqueId, distTagName) => this.distTagName[uniqueId] = distTagName
    
    this.warnings = new Set() /* 保存编译过程的警告 */

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

  // TODO add 传入组件的检查
  init({
    entryPath = '',
    exportPath = '',
    reactCompString = '',
    cssString = '',
    cssType = 'css' 
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
    process.env.COMPILE_ENV = Boolean(entryPath) ? 'node' : 'browser'
    this.cssString = cssString
    this.cssType = cssType
    this.tasks = []

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
      cssType: this.cssType,
      entryPath: this.entryPath,
      exportPath: this.exportPath,
      reactCompString: this.reactCompString,
      cssString: this.cssString,
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
    
    // 计算继承样式
    this.inheritStyle = this.getInheritStyle()

    // 移除无效样式（行内的非继承样式、非行内的继承样式）
    this.removedInvalidStyle = {
      exceptInherit: this.removeInvalidStyle(this.mixinedStyleExceptInherit),
    }

    // 转换成RN的stylesheet结果
    this.convertedStyleToRN = {
      exceptInherit: this.convertStyleToRN(this.removedInvalidStyle.exceptInherit),
    }

    // package
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
    
    // 生成最终的对象style(inherit样式都是从exceptInherit中通过omit、extract生成)
    this.finalStyleObject = this.mergeByKey(this.convertedStyleToRN.exceptInherit, {})

    // 输出到dist
    Object.entries(this.graph).forEach(([filePath, info]) => {
      const {
        fileType,
        exportPath,
        result,
        usingComponent,
      } = info
      
      // 输出react native.jsx
      const finalResult = this.generateReactNativeComponent({
        importReactCode: this.astUtils.ast2code(this.collections.importReactPath),
        fileType,
        code: result,
        usingComponent,
      })

      if (!process.env.COMPILE_ENV || process.env.COMPILE_ENV === 'node') {
        const fs = require('fs-extra')
        if (exportPath) {
          this.tasks.push(() => {
            if (fileType === 'react') {
              fs.writeFileSync(exportPath, finalResult, 'utf8')
            } else if (fileType === 'css') {
              /* 后续直接处理stylesheet */
            }
            else {
              // 非jsx、非css资源
              fs.copySync(filePath, exportPath)
            }
            this.log(`输出到'${exportPath}' -> success`)
          })
        }
      } else {
        if (fileType === 'react') {
          this.tasks.push({
            js: finalResult,
          })
        }
      }
    })

    // 输出stylesheet、输出rnUtils、warnings
    const stylesheetContent = sortAndStringify(this.finalStyleObject)
    const rnUtilsContent = require('./config/distUtils').call(this)
    const warnings = Array.from(this.warnings)

    if (!process.env.COMPILE_ENV || process.env.COMPILE_ENV === 'node') {
      const fs = require('fs')
      this.tasks.push(() => {
        const stylesheetPath = this.outputDir + `/${this.enums.STYLESHEET_FILE_NAME}.js`
        fs.writeFileSync(stylesheetPath, `export default ` + stylesheetContent, 'utf8')
      }, () => {
        const rnUtilsPath = this.outputDir + `/${this.enums.RNUTILS_FILE_NAME}.js`
        fs.writeFileSync(rnUtilsPath, rnUtilsContent, 'utf8')
      })
    } else {
      this.tasks.push({
        stylesheet: stylesheetContent
      }, {
        utils: rnUtilsContent
      }, {
        warnings: warnings
      })
    }
    
    if (this.compileType === this.enums.SINGLE_FILE) {
      return this.tasks
    } else {
      Promise.all(this.tasks.map(task => task()))
    }
  }
}

function sortAndStringify(styleObj) {
  const result = {}
  Object.keys(styleObj).sort().map(key => result[key] = styleObj[key])
  return JSON.stringify(result, null, 2)
}