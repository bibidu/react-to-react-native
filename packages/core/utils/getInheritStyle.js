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
    let mixinStyle = {}
    parentsUniqueId.forEach(uniqueId => {
      const externalStyle = ctx.externalToInlineStyle[uniqueId] || {}
      const tagSelfStyle = ctx.tagSelfStyle[uniqueId] || {}
      const staticInlineStyle = ctx.initialInlineStyle[uniqueId] || {}
      const activeInlineStyle = {}
      // TODO: update 修改activeClassName名称（包含ast）更符合语义
      const { activeClassName: activeInlineStyleAst } = ctx.uniqueNodeInfo[uniqueId] || []
      // console.log(uniqueId);
      // if (uniqueId === 'unique_id2') {
      //   console.log('fkwaejflkjawelkf');
      // }
      for (let i = 0; i < activeInlineStyleAst.length; i++) {
        const item = activeInlineStyleAst[i]
        // const className = ctx.astUtils.ast2code(item.node)
        ! activeInlineStyle[key] &&  (activeInlineStyle[key] = [])
        activeInlineStyle[key].push(item)
      }
      
      // 当前策略： 
      // 继承父级样式时，会将所有父级的“所有类型动态”（内联动态 > 内联静态 > 外联 > 标签自带）进行混合，
      mixinStyle = Object.assign(
        {},
        mixinStyle,
        externalStyle,
        staticInlineStyle,
        activeInlineStyle,
        tagSelfStyle,
      )
    })
    const removeKeys = Object.keys(mixinStyle).filter(k => (
      !canInheritStyleName.includes(k) && k !== key
    ))
    return ctx.omit(mixinStyle, removeKeys)
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