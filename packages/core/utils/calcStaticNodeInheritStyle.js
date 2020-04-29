const cheerio = require('cheerio')

module.exports = function calcStaticNodeInheritStyle() {
  const ctx = this
  const {
    textNames,
    canInheritStyleName,
  } = ctx.constants
  const extract = (obj, extractKeys) => {
    const result = {}
    for (let key in obj) { extractKeys.includes(key) && (result[key] = obj[key])}
    return result
  }
  const _extract = (obj) => extract(obj, canInheritStyleName)
  const inheritStyle = {}

  function getmixinAncestorStyle (parentsUniqueIds) {
    const mixedAncestorStyle = {}

    parentsUniqueIds.forEach(uniqueId => {
      // 只继承祖先的静态样式
      const externalStyle = ctx.externalToInlineStyle[uniqueId] || {}
      const tagStyle = ctx.tagSelfStyle[uniqueId] || {}
      const inlineStyle = ctx.externalToInlineStyle[uniqueId] || {}

      Object.assign(
        mixedAncestorStyle,
        _extract(tagStyle),
        _extract(externalStyle),
        _extract(inlineStyle),
      )
    })
    
    return mixedAncestorStyle
  }

  const mixinMultipleFileHtml = this.pureHtmlString
  const $ = cheerio.load(mixinMultipleFileHtml)

  textNames.forEach(tagName => {
    const els = $(tagName)
    if (els.length) {
      els.each((idx, el) => {
        const upwardsParentsUniqueId = []
        let parent = $(el).parent()
        let uniqueId = null
        while (parent.length && (uniqueId = $(parent).attr('unique_id'))) {
          upwardsParentsUniqueId.push(uniqueId)
          parent = $(parent).parent()
        }
        const mixinAncestorStyle = getmixinAncestorStyle(upwardsParentsUniqueId)
        if (Object.keys(mixinAncestorStyle).length) {
          inheritStyle[$(el).attr(ctx.enums.HTML_UNIQUE_ID_ATTRNAME)] = mixinAncestorStyle
        }
      })
    }
  })
  return inheritStyle
}