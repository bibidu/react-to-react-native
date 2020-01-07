const jsxUtils = {
  name: 'jsxUtils',

  /**
   * 获取JSX某个属性的值
   * @param {*} JSXElementPath 
   * @param {*} attrName 
   */
  getJSXAttributeValue(JSXElementPath, attrName) {
      const attributes = JSXElementPath.get('openingElement').get('attributes')
    
      for (let attribute of attributes) {
        if (attribute.get('name').isJSXIdentifier({ name: attrName })) {
          return attribute.get('value')
        }
      }
  },

  /**
   * 获取JSX某个属性
   * @param {*} JSXElementPath 
   * @param {*} attrName 
   */
  getJSXAttribute(JSXElementPath, attrName) {
    const attributes = JSXElementPath.get('openingElement').get('attributes')
    
    for (let attribute of attributes) {
      if (attribute.get('name').isJSXIdentifier({ name: attrName })) {
        return attribute
      }
    }
  }
}

module.exports = jsxUtils

