module.exports = function addStyleAccordingToUniqueId({ ctx, t }) {

  function createArrayCallInJSXExpression(activeExpressionArray) {
    return t.jsxExpressionContainer(
      t.CallExpression(
        t.MemberExpression(
          t.ArrayExpression(
            activeExpressionArray.map(expression => expression.node)
          ),
          t.identifier('map'),
          false
        ),
        [t.ArrowFunctionExpression(
          [t.identifier('k')],
          t.MemberExpression(
            t.identifier(ctx.enums.STYLESHEET_NAME),
            t.identifier('k'),
            true
          ),
          false
        )]
      )
    )
  }

  return {
    JSXElement(path) {
      const uniqueIdPrefix = ctx.enums.UNIQUE_ID
      const uniqueIdPath = ctx.jsxUtils.getJSXAttributeValue(path, uniqueIdPrefix)
      const uniqueId = uniqueIdPath.node.value

      let {
        activeClassName,
        activeId,
      } = ctx.uniqueNodeInfo[uniqueId]
      if (!activeClassName) activeClassName = []
      if (!activeId) activeId = []
      const activeExpressionArray = activeClassName.concat(activeId)

      if (activeExpressionArray.length) {
        const attributeValuePath = createArrayCallInJSXExpression(activeExpressionArray)
        const jsxAttributePath = t.JSXAttribute(
          t.JSXIdentifier('style'),
          attributeValuePath
        )
        path.get('openingElement').pushContainer('attributes', jsxAttributePath)
      }
    }
  }
}
