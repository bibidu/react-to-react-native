const asts = require('./asts')
const compilers = require('./compilers')
const utils = require('./utils')


module.exports = class ReactToReactNative {
  constructor() {
    /* 收集的组件信息合集 */
    this.collections = {
      exports: [] /* 暴露出的组件名 */
    }
    this.reactCompString = '' /* react组件字符串 */
    this.cssString = '' /* css字符串 */
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
    reactCompString,
    cssString = '',
    cssType = 'scss' 
  } = {}) {
    if (!reactCompString) {
      this.error('expected the type of reactCompString is react component string!')
    }
    this.reactCompString = reactCompString
    this.cssString = cssString
    this.cssType = cssType

    return this
  }

  start() {
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
      this.pureHtmlString = this.generatePureHtmlString(this.fsRelations, this.uniqueNodeInfo)
      this.injectBrowserScript = this.generateInjectBrowserScript({
        html: this.pureHtmlString,
        css: this.afterCssToObject
      })
      return this.runInBrowser({ script: this.injectBrowserScript })
    }).then((result) => {
      console.log(this.initialInlineStyle)
      console.log(this.astUtils.ast2code(this.afterProcessAST))
      return
      return this.package(this.afterProcessAST)
    })
    .then(() => this)
  }
}