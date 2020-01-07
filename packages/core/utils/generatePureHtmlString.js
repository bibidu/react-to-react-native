const ENTRY = 'ROOT-render'
const TAB_SIZE = 2

module.exports = function generatePureHtmlString({
  fsRelations,
  uniqueNodeInfo,
  isTag,
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
        const { id, className } = uniqueNodeInfo[uniqueId]
        const classAttr = className ? ` class="${className}"` : ''
        const idAttr = id ? ` id="${id}"` : ''

        html += `${block}<${tagName} uniqueId="${uniqueId}"${classAttr}${idAttr}>\n`
        html += generatePureHtmlString({
          fsRelations,
          uniqueNodeInfo,
          isTag,
        }, item, tabSize + TAB_SIZE)
        html += `${block}</${tagName}>\n`
      } else {
        html += generatePureHtmlString({
          fsRelations,
          uniqueNodeInfo,
          isTag,
        }, item, tabSize)
      }
    }
  }
  return html
}
