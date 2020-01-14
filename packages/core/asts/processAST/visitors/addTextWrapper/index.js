module.exports = function addTextWrapper({ ctx, t }) {

  const createSpanWrapper = (t, node) => t.jsxElement(
    t.jsxOpeningElement(t.jsxIdentifier('span'), [], false),
    t.jsxClosingElement(t.jsxIdentifier('span')),
    [node],
    false
  )
  
  const createSpanWrapperWithText = (t, text) => t.jsxElement(
    t.jsxOpeningElement(
      t.jsxIdentifier('span'), [
        t.jsxAttribute(
          t.jsxIdentifier(ctx.enums.ACTIVE_ADD_TEXT_MARK),
          t.stringLiteral('true')
        )
      ],
      false
    ),
    t.jsxClosingElement(t.jsxIdentifier('span')),
    [t.JSXText(text)],
    false
  )

  const checkIsHaveTextNodeMark = (path) => {
    const attrsPath = path.get('openingElement').get('attributes')
    return Boolean(
      attrsPath.length && attrsPath.some((attr) => attr.get('name').isJSXIdentifier({ name: ctx.enums.STATIC_MARK }))
    )
  }

  return {
    JSXExpressionContainer(path) {
      const parent = path.findParent(() => true)
      if (parent.isJSXElement()) {
        const parentIsTextNode = parent.get('openingElement').get('name').isJSXIdentifier({ name: 'span' })
        const hasTextNodeMark = checkIsHaveTextNodeMark(parent)
        if (hasTextNodeMark && !parentIsTextNode) {
          path.replaceWith(createSpanWrapper(t, path.node))
          path.skip()
        }
      }
    },
    JSXText(path) {
      if (path.node.value.trim()) {
        const parent = path.findParent(node => node.isJSXElement())
        const parentIsTextNode = parent.get('openingElement').get('name').isJSXIdentifier({ name: 'span' })
        if (!parentIsTextNode) {
          if (path.node.value === path.node.value.trim()) {
            const parentBlock = parent.node.loc.start.column
            path.replaceWithMultiple([
              t.JSXText(`\n${' '.repeat(parentBlock + 2)}`),
              createSpanWrapperWithText(t, path.node.value),
              t.JSXText(`\n${' '.repeat(parentBlock)}`),
            ])
          } else {
            const [before, after] = path.node.value.split(path.node.value.trim())
            path.replaceWithMultiple([
              t.JSXText('' + before),
              createSpanWrapperWithText(t, path.node.value.trim()),
              t.JSXText('' + after),
            ])
          }
          path.skip()
        }
      }
    }
  }
}

