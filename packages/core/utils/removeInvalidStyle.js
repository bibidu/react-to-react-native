exports = function removeInvalidStyle(styles) {
  isStaticText = isStaticText.bind(this)

  Object.entries(styles).forEach(([uniqueId, styles]) => {
    const info = this.uniqueNodeInfo[uniqueId]
    // uniqueNodeInfo中不含有stable selector
    if (info) {
      const { tagName } = info
      
      if (!this.utils.isUserComponent(tagName)) {
        const fnName = isStaticText(tagName) ? 'extract' : 'omit'
        styles = this[fnName](styles, this.constants.canInheritStyleName)
      }
      if (!isStaticText(tagName) && !this.utils.isUserComponent(tagName)) {
        styles = this.omit(styles, this.constants.canInheritStyleName)
      }
    }
  })
  
  return styles
}

function isStaticText (tagName) {
  return this.constants.textNames.includes(tagName)
}

