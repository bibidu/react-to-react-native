const asts = require('./asts')
const compilers = require('./compilers')
const utils = require('./utils')
const enums = require('./config/enums')

module.exports = class ReactToReactNative {
  constructor() {
    this.enums = enums /* 枚举字段 */

    /* 收集的组件信息合集 */
    this.collections = {
      exports: [] /* 暴露出的组件名 */
    }
    this.reactCompPath = '' /* 输入react组件绝对路径 */
    this.outputPath = '' /* 输出react-native组件绝对路径 */
    this.reactCompString = '' /* 输入react组件字符串 */
    this.cssString = '' /* 输入css字符串 */
    this.addCssString = (mark, cssString) => this.cssString += `\n/* ${mark}*/\n` + cssString
    this.cssType = '' /* scss | other */

    this.afterTsCompiled = '' /* typescript编译后 */
    this.afterCssCompiled = '' /* css编译器编译后 */
    this.afterCssToObject = {} /* css-to-object后的css对象 */
    this.pureHtmlString = '' /* 注入浏览器前的纯html */
    this.injectBrowserScript = '' /* 注入浏览器的script */
    this.externalToInlineStyle = {} /* 外联转内联的样式 */
    this.mixinedAllStyle = {} /* 混合[外联、内联、标签自带]的样式结果 */
    this.finalStyleObject = {} /* 通过react-to-react-native转换后的最终样式 */
    this.initialAST = {} /* visitors遍历前最初的ast */
    this.afterProcessAST = {} /* processAST.visitors遍历后的ast */
    this.afterPackageCode = '' /* package阶段后生成的组件code */

    this.uniqueNodeInfo = {} /* JSXElement节点的信息 */
    this.addUniqueNodeInfo = (k, { className, id, tagName, uniqueId, activeClassName, activeId, }) => {
      this.uniqueNodeInfo[k] = { className, id, tagName, uniqueId, activeClassName, activeId, }
    }

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

  init({
    reactCompPath = '',
    reactCompString = '',
    outputPath = '',
    cssString = '',
    cssType = 'scss' 
  } = {}) {
    if (!reactCompPath && !reactCompString) {
      this.error('expected the type of reactCompString is react component string!')
    }
    this.reactCompPath = reactCompPath
    this.outputPath = outputPath
    this.reactCompString = reactCompString
    this.cssString = cssString
    this.cssType = cssType

    if (!process.env.COMPILE_ENV || process.env.COMPILE_ENV === 'node') {
      this.reactCompString = require('fs').readFileSync(this.reactCompPath, 'utf8')
    }

    return this
  }

  start() {
    return this.typescriptCompiler(this.reactCompString)
      .then(afterTsCompiled => {
        this.afterTsCompiled = afterTsCompiled
        this.initialAST = this.astUtils.code2ast(this.afterTsCompiled)

        return this.processAST(this.initialAST)
      }).then(afterProcessAST => {
        this.afterProcessAST = afterProcessAST

        return this.scssCompiler(this.cssString)
      }).then(afterCssCompiled => {
        this.afterCssCompiled = afterCssCompiled
        
        return this.cssToObject(this.afterCssCompiled)
      }).then(afterCssToObject => {
        this.afterCssToObject = afterCssToObject
        this.pureHtmlString = this.generatePureHtmlString({
          fsRelations: this.fsRelations,
          uniqueNodeInfo: this.uniqueNodeInfo,
          isTag: (uniqueId) => uniqueId.startsWith(this.enums.UNIQUE_ID),
          uniqueIdName: this.enums.HTML_UNIQUE_ID_ATTRNAME,
        })

        return this.convertExternalToInline({
          html: this.pureHtmlString,
          css: this.afterCssToObject,
          uniqueIdName: this.enums.HTML_UNIQUE_ID_ATTRNAME,
        })
      }).then(externalToInlineStyle => {
        this.externalToInlineStyle = externalToInlineStyle
        this.log('mixinAllStyle')

        return this.mixinAllStyle({
          external: this.externalToInlineStyle,
          inline: this.initialInlineStyle,
          self: this.tagSelfStyle,
          cssObject: this.afterCssToObject
        })
      }).then((mixinedStyle) => {
        this.mixinedAllStyle = mixinedStyle
        this.log('transformMixinedStyle')

        return this.transformMixinedStyle(this.mixinedAllStyle)
      }).then(finalStyleObject => {
        this.finalStyleObject = finalStyleObject

        return this.packageAST(this.afterProcessAST)
      }).then(result => {
        this.afterPackageCode = result
        const finalResult = this.generateReactNativeComponent({
          ctx: this
        })
        if (!process.env.COMPILE_ENV || process.env.COMPILE_ENV === 'node') {
          if (this.outputPath) {
            require('fs').writeFileSync(this.outputPath, finalResult, 'utf8')
            this.log(`输出到'${this.outputPath}' -> success`)
          }
        }

        return finalResult
      })
      // .then(() => this)
  }
}