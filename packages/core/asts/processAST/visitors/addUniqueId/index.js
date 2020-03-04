
module.exports = function addUniqueId({ ctx, t }) {

  const createJSXAttribute = (name, value) => t.JSXAttribute(
    t.JSXIdentifier(name),
    t.StringLiteral(value)
  )
  
  return {
    JSXElement(path) {
      const attributes = path.get('openingElement').get('attributes')
      path.node.openingElement.attributes.unshift(
        createJSXAttribute(ctx.enums.UNIQUE_ID, ctx.uniqueIdHelper())
      )
    }
  }
}