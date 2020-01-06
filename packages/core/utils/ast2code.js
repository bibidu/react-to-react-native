const generator = require('@babel/generator').default

module.exports = function ast2code(ast) {
  return generator(ast).code
}