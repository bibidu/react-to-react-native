module.exports = function addUniqueId({ ctx, t }) {
  return {
    JSXElement(path) {
      const attributes = path.get('openingElement').get('attributes')
      path.node.openingElement.attributes.unshift(
        createJSXAttribute(t, '@@unique__id', uniqueId())
      )
    }
  }
}

const createJSXAttribute = (t, name, value) => t.JSXAttribute(
  t.JSXIdentifier(name),
  t.StringLiteral(value)
)

let id = 0
const uniqueId = () => {
  return `@@uniqueId__${++id}`
}