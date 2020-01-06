module.exports = function getJSXAttribute(JSXElementPath, attrName) {
  const attributes = JSXElementPath.get('openingElement').get('attributes')

  for (let attribute of attributes) {
    if (attribute.get('name').isJSXIdentifier({ name: attrName })) {
      return attribute.get('value')
    }
  }
}