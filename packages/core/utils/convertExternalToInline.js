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
}) {
  const obj = {}
  const { externalStyle } = css
  const $ = cheerio.load(html)

  removeUnSupportStyle(externalStyle)
  Object.entries(externalStyle).forEach(([selector, style]) => {
    const el = $(selector)
    if (el.length) {
      obj[el.attr(uniqueIdName)] = style
    }
  })

  return obj
}
