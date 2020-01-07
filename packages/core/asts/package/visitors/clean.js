module.exports = function clean({ ctx, t }) {

  return {
    JSXElement(path) {
      const uniqueIdPrefix = ctx.getUniqueIdPrefix()
      const uniqueIdAttr = ctx.jsxUtils.getJSXAttribute(path, uniqueIdPrefix)
      // 移除uniqueId
      uniqueIdAttr.remove()
    }
  }
}