const merge = require('./mergeByKey')


module.exports = function mixinInheritAndOther(mixinedStyleExceptInherit, inheritStyle) {
  const ctx = this
  const key = ctx.enums.ACTIVE_CLASSNAME_WILL_REPLACEBY_STYLESHEET

  function isStaticText (tagName) {
    return ctx.constants.textNames.includes(tagName)
  }

  const result = merge(inheritStyle, mixinedStyleExceptInherit)
  
  Object.entries(result).forEach(([uniqueId, styles]) => {
    const info = this.uniqueNodeInfo[uniqueId]

    // uniqueNodeInfo中不含有stable selector
    if (info) {
      const { tagName } = info
      if (!isStaticText(tagName) && !this.isUserComponent(tagName)) {
        this.omit(styles, ctx.constants.canInheritStyleName)
      }
    }
  })
  
  return result
}
