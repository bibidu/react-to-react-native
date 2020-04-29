const t = require('@babel/types')
const traverse = require('@babel/traverse').default
const visitors = require('./visitors')

module.exports = function processAST(ast) {
  this.logger.log({ type: 'flow', msg: 'traversing process AST' })

  visitors.forEach(visitor => traverse(ast, visitor({ ctx: this, t, })))
  return ast
}