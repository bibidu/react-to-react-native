const fs = require('fs')
const fse = require('fs-extra')
const path = require('path')
const asts = require('./asts')
const compilers = require('./compilers')
const utils = require('./utils')
const enums = require('./config/enums')
const constants = require('./config/constants')

module.exports = new class ReactToReactNative {
  constructor() {
    global.__NODE__ = typeof process !== undefined

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
    this.cssObject = { /* 外联转对象形式的CSS */
      externalStyle: {},
      stableClassNames: {},
    }

    this.graph = {} /* 组件图信息 */
    this.currentCompilePath = '' /* 当前正在编译的组件路径 */
    this.afterTsCompiled = '' /* typescript编译后 */
    this.pureHtmlString = '' /* 组件合集的html string */
    this.externalToInlineStyle = {} /* 外联转内联的样式 */
    this.mixinedStyle = {} /* 混合[外联、内联、标签自带]的样式结果 */
    this.removedInvalidStyle= {} /* 已经移除无效样式的样式结果 */
    this.convertedStyleToRN = {} /* 通过react-to-react-native转换后的样式 */
    this.afterProcessAST = {} /* processAST.visitors遍历后的ast */

    this.uniqueNodeInfo = {} /* JSXElement节点的信息 */
    this.addUniqueNodeInfo = (k, nodeInfo) => {
      this.uniqueNodeInfo[k] = this.uniqueNodeInfo[k] || {}
      this.uniqueNodeInfo[k] = Object.assign({}, this.uniqueNodeInfo[k], nodeInfo)
    }

    this.fsRelations = {} /* 节点间关系 */
    this.addFsRelation = (k, v) => {
      if (k === v) return
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

    this.generateStyle = {} /* 计算多种来源后的样式 */
    this.addGenerateStyle = (key, style) => this.generateStyle[key] = style
  
    this.distTagName = {} /* uniqueId对应的输出标签名 */
    this.addDistTagName = (uniqueId, distTagName) => this.distTagName[uniqueId] = distTagName
    
    this.warnings = new Set() /* 保存编译过程的警告 */
    this.errors = new Set() /* 保存编译过程的报错 */
    this.copyResources = new Set() /* 保存需要额外拷贝的资源绝对路径 */

    this.useRuntimeUtilByFilepath = {} /* 根据文件名收集使用到的 运行时函数名 */
    this.addRuntimeUseUtil = (utilName) => {
      const filepath = this.currentCompilePath
      if (!this.useRuntimeUtilByFilepath[filepath]) {
        this.useRuntimeUtilByFilepath[filepath] = []
      }
      this.useRuntimeUtilByFilepath[filepath].push(utilName)
    }

    this.initAsts()
    this.initCompilers()
    this.initUtils()
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

  // TODO add 传入组件的检查
  init({
    entryPath = '',
    exportPath = '',
    reactCompString = '',
    cssString = '',
    cssType = 'css',
  } = {}) {
    if (!entryPath && !reactCompString) {
      // TODO: add 保存该错误，并在start时返回包含错误的数组
      thislogger.error('expected the type of reactCompString is react component string!')
    }
    this.entryPath = entryPath
    this.exportPath = exportPath
    this.reactCompString = reactCompString
    // TODO: replace 对entryPath存在时的路径进行检查，当该文件路径不合法时this.error, 并保存该错误
    this.compileType = Boolean(entryPath) ? this.enums.MULTIPLE_FILE : this.enums.SINGLE_FILE
    this.cssString = cssString
    this.cssType = cssType
    this.tasks = []

    if (__NODE__) {
      // TODO: remove 移除该判断，因为前文代码compileType时已经对reactComPath校验通过
      if (this.entryPath) {
        this.reactCompString = fs.readFileSync(this.entryPath, 'utf8')
      }
    }

    return this
  }

  async start() {
    this.utils.logStart('compile')

    if (__NODE__) {
      this.outputDir = path.dirname(this.exportPath)
    }
    
    // 构建graph
    this.graph = await this.createGraph({
      compileType: this.compileType,
      cssType: this.cssType,
      entryPath: this.entryPath,
      exportPath: this.exportPath,
      reactCompString: this.reactCompString,
      cssString: this.cssString,
    })

    if (__NODE__) {
      // 添加输出路径 importSource
      Object.entries(this.graph).forEach(([filePath, component]) => {
        if (!component.exportPath) {
          const entryRelativePath = path.relative(this.entryPath, filePath)
          component.exportPath = path.resolve(this.exportPath, entryRelativePath)
        }
      })
    }
    
    // 收集所有cssObject
    for await (let filePath of Object.keys(this.graph)) {
      this.currentCompilePath = filePath
      const { code, fileType } = this.graph[filePath]
      if (fileType === 'css') {
        const afterScssCompiled = await this.scssCompiler(code, filePath)
        const cssObject = await this.cssToObject(afterScssCompiled)

        this.cssObject.externalStyle = Object.assign(
          this.cssObject.externalStyle, cssObject.externalStyle
        )
        this.cssObject.stableClassNames = Object.assign(
          this.cssObject.stableClassNames, cssObject.stableClassNames
        )
      }
    }

    // process
    for await (let filePath of Object.keys(this.graph)) {
      this.currentCompilePath = filePath
      const component = this.graph[filePath]
      const { ast, fileType } = component
      if (fileType === 'react') {
        component.afterProcessAST = this.processAST(ast)
        // 构建父子节点间关系
        this.astToRelationTree(component.afterProcessAST, filePath)
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
      hashHelper: this.utils.hash,
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
        this.convertTagReference(ast, {
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
    this.mixinedStyle = this.utils.mixinStyle({
      external: this.externalToInlineStyle, /* static */
      inline: this.initialInlineStyle, /* maybe active */
      self: this.tagSelfStyle, /* static */
      cssObject: this.cssObject, /* static */
    })

    // 转换成RN的stylesheet结果
    this.convertedStyleToRN = this.convertStyleToRN(this.mixinedStyle)

    // 修改标签、样式相关
    Object.entries(this.graph).forEach(([, component]) => {
      const {
        ast,
        fileType,
      } = component
      if (fileType === 'react') {
        this.styleFixer(ast, {
          addUsingComponent: (name) => {
            component.usingComponent = (component.usingComponent || [])
            if (!component.usingComponent.includes(name)) {
              component.usingComponent.push(name)
            }
          }
        })
      }
    })

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
        importReactCode: this.astUtils.ast2code(this.collections.importReactPath[filePath]),
        fileType,
        code: result,
        usingComponent,
        getResourceRelativePath: (currentResoucePath) => {
          if (!exportPath) {
            return `./${currentResoucePath}`
          }
          const resourceDist = path.join(path.dirname(this.exportPath), currentResoucePath)
          // 单文件模式时不存在exportPath
          const currentDist = exportPath
          const relativePath = path.relative(path.dirname(currentDist), resourceDist)
      
          return relativePath.startsWith('.') ? relativePath : `./${relativePath}`
        },
        useRuntimeUtil: Boolean(this.useRuntimeUtilByFilepath[filePath]),
      })
      
      if (__NODE__) {
        if (exportPath) {
          this.tasks.push(() => {
            if (fileType === 'react') {
              fse.outputFileSync(exportPath, finalResult, 'utf8')
              this.logger.log({ type: 'output', msg: exportPath })
          } else if (fileType === 'css') {
              /* 后续直接处理stylesheet */
            }
            else {
              // 非jsx、非css资源
              fse.copySync(filePath, exportPath)
              this.logger.log({ type: 'copy', msg: exportPath })
            }
            // const logDistpath = exportPath.includes(__dirname) ? exportPath.split(__dirname)[1] : exportPath
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
    const stylesheetContent = sortAndStringify(
      Object.assign({}, this.convertedStyleToRN, this.generateStyle)
    )
    const rnUtilsContent = require('./config/distUtils').call(this)
    const warnings = Array.from(this.warnings)
    const errors = Array.from(this.errors)

    if (__NODE__) {
      this.tasks.push(() => {
        const stylesheetPath = this.outputDir + `/${this.enums.STYLESHEET_FILE_NAME}.js`
        fs.writeFileSync(stylesheetPath, `export default ` + stylesheetContent, 'utf8')
        this.logger.log({ type: 'output', msg: stylesheetPath })
      }, () => {
        const rnUtilsPath = this.outputDir + `/${this.enums.RNUTILS_FILE_NAME}.js`
        fs.writeFileSync(rnUtilsPath, rnUtilsContent, 'utf8')
        this.logger.log({ type: 'output', msg: rnUtilsPath })
      })
    } else {
      this.tasks.push({
        stylesheet: stylesheetContent
      }, {
        utils: rnUtilsContent
      }, {
        warnings: warnings
      }, {
        errors: errors
      })
    }
    
    // 额外需要拷贝的资源
    const extraCopyResources = Array.from(this.copyResources)

    if (__NODE__) {
      if (extraCopyResources.length) {
        extraCopyResources.forEach(resourcePath => {
          const entryRelativePath = path.relative(this.entryPath, resourcePath)
          const exportPath = path.resolve(this.exportPath, entryRelativePath)
          fse.copySync(resourcePath, exportPath)
          this.logger.log({ type: 'copy', msg: exportPath })
        })
      }
    }

    if (this.compileType === this.enums.SINGLE_FILE) {
      return this.tasks
    } else {
      await Promise.all(this.tasks.map(task => task()))
    }

    const compileTime = this.utils.logEnd('compile')
    this.logger.log({ type: 'spendTime', msg: `共 ${compileTime}s`})
  }
}()

function sortAndStringify(styleObj) {
  const result = {}
  Object.keys(styleObj).sort().map(key => result[key] = styleObj[key])
  return JSON.stringify(result, null, 2)
}