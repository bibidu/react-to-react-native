const cheerio = require('cheerio')

const unSupportStyles = [
  ':hover',
]

function removeUnSupportStyle(style) {
  Object.keys(style).forEach(key => {
    if (unSupportStyles.some(item => key.includes(item))) {
      delete style[key]
    }
  })
}

module.exports = function convertExternalToInline({
  html,
  css,
  uniqueIdName,
  activeAddTextMark,
}) {
  const obj = {}
  const { externalStyle } = css
  const $ = cheerio.load(html)

  removeUnSupportStyle(externalStyle)
  Object.entries(externalStyle).forEach(([selector, style]) => {
    const els = $(selector)

    els.map((i, el) => {
      const element = $(el)
      const activeAddTextNode = Boolean(element.attr(activeAddTextMark))
      if (!activeAddTextNode) {
        obj[element.attr(uniqueIdName)] = style
      }
    })
  })

  return obj
}
