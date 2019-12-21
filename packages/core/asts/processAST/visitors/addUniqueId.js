module.exports = function addUniqueId({ ctx }) {
  return {
    JSXElement(path) {
      // console.log('==')
      // console.log(Object.keys(path.node))
      // console.log(Object.keys(path.node.openingElement))
    }
  }
}