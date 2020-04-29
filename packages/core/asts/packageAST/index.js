const traverse = require('@babel/traverse').default
const t = require('@babel/types')
const visitors = require('./visitors')

module.exports = function packageAST(ast) {
  this.logger.log({ type: 'flow', msg: 'traversing package AST' })

  visitors.forEach(visitor => traverse(ast, visitor({ ctx: this, t, })))
  return ast
}