function merge(...objs) {
  const mixins = {}
  for (let obj of objs) {
    for (let item of Object.keys(obj)) {
      if (!mixins[item]) {
        mixins[item] = obj[item]
      } else {
        mixins[item] = Object.assign({}, mixins[item], obj[item])
      }
    }
  }
  return mixins
}

module.exports = function mixinAllStyle({
  external,
  inline,
  self,
}) {
  // 临时方案: 按照内联样式 > 外联样式 > 自身样式进行merge
  const mixins = merge(self, external, inline)

  return mixins
}
