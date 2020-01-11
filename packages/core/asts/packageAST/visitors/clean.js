module.exports = function clean({ ctx, t }) {

  return {
    JSXElement(path) {
      // 移除标记
      const marks = [
        ctx.enums.STATIC_MARK,
        ctx.enums.UNIQUE_ID,
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