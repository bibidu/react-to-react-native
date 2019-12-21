module.exports = function addTextWrapper({ ctx, t }) {
  return {
    JSXExpressionContainer(path) {
      const parent = path.findParent(node => node.isJSXElement())
      const parentIsTextNode = parent.get('openingElement').get('name').isJSXIdentifier({ name: 'span' })
      const hasTextNodeMark = checkIsHaveTextNodeMark(parent)
      if (hasTextNodeMark && !parentIsTextNode) {
        path.replaceWith(createSpanWrapper(t, path.node))
        path.skip()
      }
    },
    JSXText(path) {
      if (path.node.value.trim()) {
        path.replaceWith(createSpanWrapper(t, path.node))
        path.skip()
      }
    }
  }
}

const STATIC_TEXT = 'rn-text'

const checkIsHaveTextNodeMark = (path) => {
  const attrsPath = path.get('openingElement').get('attributes')
  return Boolean(
    attrsPath.length && attrsPath.some((attr) => attr.get('name').isJSXIdentifier({ name: STATIC_TEXT }))
  )
}

const createSpanWrapper = (t, node) => t.jsxElement(
  t.jsxOpeningElement(t.jsxIdentifier('span'), [], false),
  t.jsxClosingElement(t.jsxIdentifier('span')),
  [node],
  false
)
