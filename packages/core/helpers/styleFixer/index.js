const t = require('@babel/types')
const traverse = require('@babel/traverse').default

let ctx

const load = (key) => require(`./resolves/${key}`)

module.exports = function styleFixer(ast, {
  addUsingComponent,
}) {
  ctx = this
  
  traverse(ast, {
    JSXElement(path) {
      const uniqueIdPath = ctx.jsxUtils.getJSXAttributeValue(path, ctx.enums.UNIQUE_ID)
      const uniqueId = uniqueIdPath.node.value
      const { tagName: rawTagName } = ctx.uniqueNodeInfo[uniqueId]

      if (ctx.isUserComponent(rawTagName)) return

      if (rawTagName === 'i') {
        return load('I')({path, t, ctx, addUsingComponent})
      }
    }
  })
}