const merge = require('./mergeByKey')


module.exports = function removeInvalidStyle(styles) {
  const ctx = this
  const key = ctx.enums.ACTIVE_CLASSNAME_WILL_REPLACEBY_STYLESHEET

  function isStaticText (tagName) {
    return ctx.constants.textNames.includes(tagName)
  }

  Object.entries(styles).forEach(([uniqueId, styles]) => {
    const info = this.uniqueNodeInfo[uniqueId]
    // uniqueNodeInfo中不含有stable selector
    if (info) {
      const { tagName } = info
      if (!this.isUserComponent(tagName)) {
        const fnName = isStaticText(tagName) ? 'extract' : 'omit'
        this[fnName](styles, ctx.constants.canInheritStyleName)
      }
      if (!isStaticText(tagName) && !this.isUserComponent(tagName)) {
        this.omit(styles, ctx.constants.canInheritStyleName)
      }
    }
  })
  
  return styles
}
