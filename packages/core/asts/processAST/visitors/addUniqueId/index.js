
module.exports = function addUniqueId({ ctx, t }) {

  return {
    JSXElement(path) {
      const attributes = path.get('openingElement').get('attributes')
      path.node.openingElement.attributes.unshift(
        createJSXAttribute(t, ctx.enums.UNIQUE_ID, ctx.uniqueIdHelper())
      )
    }
  }
}

const createJSXAttribute = (t, name, value) => t.JSXAttribute(
  t.JSXIdentifier(name),
  t.StringLiteral(value)
)
