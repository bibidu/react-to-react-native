const t = require('@babel/types')
const traverse = require('@babel/traverse').default
const visitors = require('./visitors')
const gen = require('@babel/generator').default

module.exports = function processAST(ast) {
  this.log('processAST')
  visitors.forEach(visitor => traverse(ast, visitor({ ctx: this, t, })))
  const code = gen(ast, {}).code
  return ast
}