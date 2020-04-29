 const visitors = [
  require('./spanToDiv'), /* 先将span转成div，使span上的margin属性有效。再通过后续添加文本的text标签包裹*/
  require('./addTextWrapper'),
  require('./addUniqueId'),
  require('./collectInfo'),
]

global.__NODE__ = typeof process !== undefined
if (__NODE__) {
  visitors.unshift(require('./resolveCssPath'))
}

module.exports = visitors