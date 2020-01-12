const ENTRY = 'ROOT-render'
const TAB_SIZE = 2

const isUserComponent = (tagName) => tagName.charAt(0) !== tagName.charAt(0).toLowerCase()

module.exports = function generatePureHtmlString({
  fsRelations,
  uniqueNodeInfo,
  isTag,
  uniqueIdName,
  activeAddTextMark,
}, key = ENTRY, tabSize = 0) {
  let html = '', currentArray = fsRelations[key]
  
  if (key === ENTRY) {
    if (!currentArray || !currentArray.length) {
      throw Error('generatePureHtmlString找不到入口render')
    }
  }
  
  if (currentArray) {
    for (let item of currentArray) {
      const [uniqueId, type, tagName] = item.split('-')
      const block = ' '.repeat(tabSize)

      if (isTag(item)) {
        const { id, className, activeAddText,  } = uniqueNodeInfo[uniqueId]
        const classAttr = className ? ` class="${className}"` : ''
        const idAttr = id ? ` id="${id}"` : ''
        const activeTextAttr = activeAddText ? ` ${activeAddTextMark}="${activeAddText}"` : ''

        if (!isUserComponent(tagName)) {
          html += `${block}<${tagName} ${uniqueIdName}="${uniqueId}"${classAttr}${idAttr}${activeTextAttr}>\n`
        }

        html += generatePureHtmlString({
          fsRelations,
          uniqueNodeInfo,
          isTag,
          uniqueIdName,
          activeAddTextMark,
        }, item, tabSize + TAB_SIZE)

        if (!isUserComponent(tagName)) {
          html += `${block}</${tagName}>\n`
        }
      } else {
        html += generatePureHtmlString({
          fsRelations,
          uniqueNodeInfo,
          isTag,
          uniqueIdName,
          activeAddTextMark,
        }, item, tabSize)
      }
    }
  }
  return html
}
