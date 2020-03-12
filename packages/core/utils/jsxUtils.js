const t = require('@babel/types')

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
  },

  replaceJSXAttributeKey(path, rawAttrName, targetAttrName) {
    const attributes = path.get('openingElement').get('attributes')
    for (let attribute of attributes) {
      const attrName = attribute.get('name').node.name
      if (attrName === rawAttrName) {
        attribute.get('name').replaceWith(t.JSXIdentifier(targetAttrName))
      }
    }
  },

  removeJSXAttributeByKey(path, attrNames) {
    if (!Array.isArray(attrNames)) {
      attrNames = [attrNames]
    }
    attrNames.forEach(attrName => {
      const attrPath = jsxUtils.getJSXAttribute(path, attrName)
      if (attrPath) {
        attrPath.remove()
      }
    })
  },

  addJSXAttribute(path, attrName, attrValue, {
    attrValueIsAst,
  } = {
    attrValueIsAst: false
  }) {
    if (typeof attrValue === 'object') {
      throw Error('不支持添加对象类型的JSXAttribute')
    }
    const jsxAttributePath = t.jsxAttribute(
      t.jsxIdentifier(attrName),
      attrValueIsAst ? attrValue : t.stringLiteral(String(attrValue))
    )
    path.get('openingElement').pushContainer('attributes', jsxAttributePath)
  }
}

module.exports = jsxUtils

