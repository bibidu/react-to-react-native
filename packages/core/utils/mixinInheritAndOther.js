const merge = require('./mergeByKey')

module.exports = function mixinInheritAndOther(mixinedStyleExceptInherit, inheritStyle) {
  return merge(mixinedStyleExceptInherit, inheritStyle)
}
