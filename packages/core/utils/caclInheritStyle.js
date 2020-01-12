const t = require('@babel/types')
const traverse = require('@babel/traverse').default
const gen = require('@babel/generator').default

module.exports = function caclInheritStyle({
  styleExceptInherit,
  afterProcessAST,
}) {
  const inheritStyle = {}

  traverse(afterProcessAST, {
    JSXElement(path) {

    }
  })

  return inheritStyle
}