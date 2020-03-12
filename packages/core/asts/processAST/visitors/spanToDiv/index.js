// <span>
//   123
//   <span>456</span>
// </span>
// 调整为 =>
// <div>
//   <span>
//     123
//     <div>
//       <span>456</span>
//     </div>
//   </span>
// </div>
module.exports = function addTextWrapper({ ctx, t }) {

  return {
    JSXElement(path) {
      function _spanAddDivContainer(path) {
        const nameNode = path.get('openingElement').get('name')
        const initOpeningElement = path.node.openingElement
        const initChildren = path.node.children

        if (nameNode.isJSXIdentifier({ name: 'span' })) {
          const newOpeningElement = t.JSXOpeningElement(
            t.JSXIdentifier('div'),
            [...initOpeningElement.attributes]
          )
          const newClosingElement = t.JSXClosingElement(
            t.JSXIdentifier('div')
          )
          
          path.replaceWith(
            t.jSXElement(
              newOpeningElement,
              newClosingElement,
              [
                t.JSXElement(
                  initOpeningElement,
                  path.node.closingElement,
                  initChildren,
                  path.node.selfClosing
                )
              ]
            )
          )
          path.get('children').forEach(child => {
            child.traverse({
              JSXElement(p) {
                _spanAddDivContainer(p)
              }
            })
          })
          path.skip()
        }
      }

      _spanAddDivContainer(path)
    }
  }
}

