module.exports = function mixinInheritAndOther(mixinedStyleExceptInherit, inheritStyle) {
  return merge(mixinedStyleExceptInherit, inheritStyle)
}

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