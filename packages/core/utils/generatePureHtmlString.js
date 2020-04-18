const TAB_SIZE = 2

const rootNames = (exportsName) => [
  `Class-${exportsName}-render`,
  `Function-${exportsName}`
]

let ctx = null
module.exports = function generatePureHtmlString(info, key = 'ROOT', tabSize = 0) {
  !ctx && (ctx = this)
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
    const rootComponentPath = this.compileType === this.enums.MULTIPLE_FILE ? this.entryPath : 'react'
    const filePathHash = hashHelper(rootComponentPath)
    currentArray = fsRelations[`${filePathHash}-Default`]
    
      if (!currentArray || !currentArray.length) {
        throw Error('generatePureHtmlString找不到入口render')
      }
  }
  if (currentArray) {
    for (let item of currentArray) {
      const [uniqueId, type, tagName] = item.slice(9).split('-')
      const block = ' '.repeat(tabSize)
      // console.log(item)
      if (isTag(item)) {
        const { id, className, activeAddText,  } = uniqueNodeInfo[uniqueId]
        const classAttr = className ? ` class="${className}"` : ''
        const idAttr = id ? ` id="${id}"` : ''
        const activeTextAttr = activeAddText ? ` ${activeAddTextMark}="${activeAddText}"` : ''

        if (['Fragment', 'React.Fragment'].every(item => item !== tagName) && !ctx.isUserComponent(tagName)) {
          html += `${block}<${tagName} ${uniqueIdName}="${uniqueId}"${classAttr}${idAttr}${activeTextAttr}>\n`
        }

        html += generatePureHtmlString(info, item, tabSize + TAB_SIZE)

        if (['Fragment', 'React.Fragment'].every(item => item !== tagName) && !ctx.isUserComponent(tagName)) {
          html += `${block}</${tagName}>\n`
        }
      } else {
        html += generatePureHtmlString(info, item, tabSize)
      }
    }
  }
  return html
}
