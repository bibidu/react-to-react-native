module.exports = function isUserComponent(tagName) {
  return (
    tagName.charAt(0) !== tagName.charAt(0).toLowerCase() &&
    tagName !== 'Fragment' &&
    tagName !== 'React.Fragment'
  )
}
