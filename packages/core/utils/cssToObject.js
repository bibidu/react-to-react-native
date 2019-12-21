const postcss = require('postcss')

module.exports = function cssToObject(css) {
  let externalStyle = {}
  let stableClassNames = {}

  return new Promise((resolve, reject) => {
    this.log('cssToObject')
    postcss()
    .use(css2obj({
      callback: (_externalStyle, _stableClassNames) => {
        _externalStyle = replaceUnsupportStyle(_externalStyle)
        
        externalStyle = _externalStyle
        stableClassNames = _stableClassNames
      }
    }))
    .process(css, {
      from: ''
    }).then(() => {
      resolve({ externalStyle, stableClassNames })
    })
  })
}

const IS_PERCENT_REG = /\d+%/
function replaceUnsupportStyle(style) {
  for (let selector in style) {
    if (IS_PERCENT_REG.test(selector)) {
      delete style[selector]
    }
  }
  return style
}


const isRule = node => node.type === 'rule'
const isDecl = node => node.type === 'decl'
const isComment = node => node.type === 'comment'

const css2obj = postcss.plugin('css2obj', opts => {
  const { callback } = opts
	return (root) => {
    const obj = {}
    const stable = {}
    root.walk(node => {
      if (isRule(node)) {
        obj[node.selector] = {}
      }
      if (isDecl(node)) {
        obj[node.parent.selector][node.prop] = node.value
      }
      if (isComment(node)) {
        stable[node.parent.selector] = node.text
      }
    })
    callback(obj, stable)
  }
})