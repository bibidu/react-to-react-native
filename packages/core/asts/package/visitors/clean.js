module.exports = function clean({ ctx, t }) {

  return {
    JSXElement(path) {
      const uniqueIdPrefix = ctx.enums.UNIQUE_ID
      const uniqueIdAttr = ctx.jsxUtils.getJSXAttribute(path, uniqueIdPrefix)
      // 移除uniqueId
      uniqueIdAttr.remove()

      // 移除标记
      const marks = [
        ctx.enums.STATIC_MARK,
        'className',
        'id',
      ]
      const attributes = path.get('openingElement').get('attributes')
      for (let attribute of attributes) {
        const attrName = attribute.get('name').node.name
        if (marks.includes(attrName)) {
          attribute.remove()
        }
      }
    }
  }
}