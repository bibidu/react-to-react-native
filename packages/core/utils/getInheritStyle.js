const cheerio = require('cheerio')

module.exports = function getInheritStyle() {
  const ctx = this
  const key = ctx.enums.ACTIVE_CLASSNAME_WILL_REPLACEBY_STYLESHEET
  const {
    textNames,
    canInheritStyleName,
  } = ctx.constants
  const inheritStyle = {}

  function getmixinAncestorStyle (parentsUniqueId) {
    const ancestorsStyle = []

    parentsUniqueId.forEach(uniqueId => {
      // 具有外联样式、标签自带样式、内联样式中至少一个
      const noValidStyleExceptInherit = (
        !Boolean(uniqueId in ctx.externalToInlineStyle) &&
        !Boolean(uniqueId in ctx.tagSelfStyle) &&
        !Boolean(uniqueId in ctx.initialInlineStyle)
      )

      // 当前替代方案：由于父级样式的组成由动态 + stylesheet[uniqueId]组成，故当前继承样式也应在父级组成中提取可继承的样式部分
      const { activeClassName: activeInlineStyleAst } = ctx.uniqueNodeInfo[uniqueId] || []

      ancestorsStyle.unshift([
        noValidStyleExceptInherit ? '' : uniqueId, // stylesheet应存在的uniqueId
        activeInlineStyleAst // 动态的style
      ])
    })
    
    return ancestorsStyle
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