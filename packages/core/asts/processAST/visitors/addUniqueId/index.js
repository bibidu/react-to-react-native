
module.exports = function addUniqueId({ ctx, t }) {
  let id = 0
  const uniqueId = () => {
    return ctx.enums.UNIQUE_ID + (++id)
  }

  return {
    JSXElement(path) {
      const attributes = path.get('openingElement').get('attributes')
      path.node.openingElement.attributes.unshift(
        createJSXAttribute(t, ctx.enums.UNIQUE_ID, uniqueId())
      )
    }
  }
}

const createJSXAttribute = (t, name, value) => t.JSXAttribute(
  t.JSXIdentifier(name),
  t.StringLiteral(value)
)
