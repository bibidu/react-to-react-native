const asts = require('./asts')
const compilers = require('./compilers')
const utils = require('./utils')


module.exports = class ReactToReactNative {
  constructor() {
    this.reactCompString = '' /* react组件字符串 */
    this.cssString = '' /* css字符串 */
    this.cssType = '' /* scss | other */

    this.afterTsCompiled = '' /* typescript编译后 */
    this.afterCssCompiled = '' /* css编译器编译后 */
    this.initialAST = {}

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
      
      const ast = this.generateAST(this.afterTsCompiled)
      this.initialAST = ast

      return this.processAST(ast)
    }).then((afterProcessAST) => {

      this.afterProcessAST = afterProcessAST
      return this.package(afterProcessAST)
    }).then(() => this)
  }
}