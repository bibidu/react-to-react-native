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
    this.reactCompPath = '' /* react组件绝对路径 */
    this.reactCompString = '' /* react组件字符串 */
    this.cssString = '' /* css字符串 */
    this.addCssString = (mark, cssString) => this.cssString += `\n/* ${mark}*/\n` + cssString
    this.cssType = '' /* scss | other */

    this.afterTsCompiled = '' /* typescript编译后 */
    this.afterCssCompiled = '' /* css编译器编译后 */
    this.injectBrowserScript = '' /* 注入浏览器的script */
    this.initialAST = {} /* visitors遍历前最初的ast */
    this.afterProcessAST = {} /* processAST.visitors遍历后的ast */

    this.uniqueNodeInfo = {} /* JSXElement节点的信息 */
    this.addUniqueNodeInfo = (k, { className, id, tagName, uniqueId }) => {
      this.uniqueNodeInfo[k] = { className, id, tagName, uniqueId }
    }

    this.fsRelations = {} /* 节点间关系 */
    this.addFsRelation = (k, v) => {
      const sons = this.fsRelations[k]
      if (!sons) {
        this.fsRelations[k] = []
      }
      this.fsRelations[k].push(v)
    }

    this.uniqueTagStyle = {} /* JSXElement节点标签自带的样式, 如h1 */
    this.addUniqueTagStyle = (uniqueId, style) => this.uniqueTagStyle[uniqueId] = style
  
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
    cssString = '',
    cssType = 'scss' 
  } = {}) {
    if (!reactCompPath && !reactCompString) {
      this.error('expected the type of reactCompString is react component string!')
    }
    this.reactCompPath = reactCompPath
    this.reactCompString = reactCompString
    this.cssString = cssString
    this.cssType = cssType

    return this
  }

  start() {
    if (!process.env.COMPILE_ENV || process.env.COMPILE_ENV === 'node') {
      this.reactCompString = require('fs').readFileSync(this.reactCompPath, 'utf8')
    }
    return Promise.all([
      this.typescriptCompiler(this.reactCompString),
      this.scssCompiler(this.cssString),
    ]).then(([
      afterTsCompiled,
      afterCssCompiled
    ]) => {

      this.afterTsCompiled = afterTsCompiled
      this.afterCssCompiled = afterCssCompiled

      return this.cssToObject(afterCssCompiled)
    }).then((afterCssToObject) => {

      this.afterCssToObject = afterCssToObject
      const ast = this.astUtils.code2ast(this.afterTsCompiled)
      this.initialAST = ast

      return this.processAST(ast)
    }).then((afterProcessAST) => {
      this.afterProcessAST = afterProcessAST
      this.pureHtmlString = this.generatePureHtmlString({
        fsRelations: this.fsRelations,
        uniqueNodeInfo: this.uniqueNodeInfo,
        isTag: (uniqueId) => uniqueId.startsWith(this.enums.UNIQUE_ID)
      })
      this.injectBrowserScript = this.generateInjectBrowserScript({
        html: this.pureHtmlString,
        css: this.afterCssToObject
      })
      return this.runInBrowser({ script: this.injectBrowserScript })
    }).then((result) => {
      return this.package(this.afterProcessAST)
    }).then((result) => {
      console.log('==result==')
      console.log(this.astUtils.ast2code(result))
    })
    .then(() => this)
  }
}