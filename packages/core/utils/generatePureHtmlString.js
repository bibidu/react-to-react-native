const TAB_SIZE = 2

const isUserComponent = (tagName) => tagName.charAt(0) !== tagName.charAt(0).toLowerCase()

const rootNames = (exportsName) => [
  `Class-${exportsName}-render`,
  `Function-${exportsName}`
]

module.exports = function generatePureHtmlString(info, key = 'ROOT', tabSize = 0) {
  const {
    fsRelations,
    uniqueNodeInfo,
    isTag,
    uniqueIdName,
    activeAddTextMark,
    collectExports,
    hashHelper,
    collections,
  } = info
  let html = '', currentArray = fsRelations[key]

  if (key === 'ROOT') {
    // 组件暴露的根入口, 暂时只考虑单入口
    const rootComponentPath = this.entryPath
    const filePathHash = hashHelper(rootComponentPath)
    const rootClassName = collections.exports[filePathHash]
    const expName = collectExports[filePathHash]

    currentArray = fsRelations[`${filePathHash}-Class-${rootClassName}`]
    
    if (!currentArray || !currentArray.length) {
      throw Error('generatePureHtmlString找不到入口render')
    }
  }
  if (currentArray) {
    for (let item of currentArray) {
      const [uniqueId, type, tagName] = item.slice(9).split('-')
      const block = ' '.repeat(tabSize)
      if (isTag(item)) {
        const { id, className, activeAddText,  } = uniqueNodeInfo[uniqueId]
        const classAttr = className ? ` class="${className}"` : ''
        const idAttr = id ? ` id="${id}"` : ''
        const activeTextAttr = activeAddText ? ` ${activeAddTextMark}="${activeAddText}"` : ''

        if (!isUserComponent(tagName)) {
          html += `${block}<${tagName} ${uniqueIdName}="${uniqueId}"${classAttr}${idAttr}${activeTextAttr}>\n`
        }

        html += generatePureHtmlString(info, item, tabSize + TAB_SIZE)

        if (!isUserComponent(tagName)) {
          html += `${block}</${tagName}>\n`
        }
      } else {
        html += generatePureHtmlString(info, item, tabSize)
      }
    }
  }
  return html
}
