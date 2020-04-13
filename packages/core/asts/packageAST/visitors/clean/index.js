module.exports = function clean({ ctx, t }) {

  return {
    JSXElement(path) {
      // 移除标记
      const marks = [
        ctx.enums.ACTIVE_ADD_TEXT_MARK,
        ctx.enums.STATIC_MARK,
        ctx.enums.BGURL_ATTR_MARK,
        ctx.enums.UNIQUE_ID,
        ctx.enums.SCROLL_MARK,
        'className',
        'id',
      ]
      const attributes = path.get('openingElement').get('attributes')
      for (let attribute of attributes) {
        if (attribute.isJSXAttribute()) {
          const attrName = attribute.get('name').node.name
          if (marks.includes(attrName)) {
            attribute.remove()
          }
        }
      }
    }
  }
}