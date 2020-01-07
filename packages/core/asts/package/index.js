const traverse = require('@babel/traverse').default
const t = require('@babel/types')
const visitors = require('./visitors')

module.exports = function package(ast) {
  this.log('package')

  visitors.forEach(visitor => traverse(ast, visitor({ ctx: this, t, })))
  return ast
}