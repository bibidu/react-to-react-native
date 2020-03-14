const idSet = new Set()
const tagCount = {}

module.exports = function uniqueId(path) {
  const tagName = this.jsxUtils.getTagName(path)
  const prefix = this.enums.UNIQUE_ID + tagName.charAt(0).toUpperCase() + tagName.slice(1)
  if (!tagCount[prefix]) {
    tagCount[prefix] = 0
  }
  return prefix + (tagCount[prefix]++ === 0 ? '' : tagCount[prefix])
}