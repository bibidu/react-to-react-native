module.exports = function addStyleAccordingToUniqueId({ ctx, t }) {

  function createArrayCallInJSXExpression(activeExpressionArray) {
    const singleExpression = t.MemberExpression(
      t.identifier(ctx.enums.STYLESHEET_NAME),
      activeExpressionArray[0].node,
      true
    )
    const multiExpression = t.CallExpression(
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
    return t.jsxExpressionContainer(
      activeExpressionArray.length === 1 ? singleExpression : multiExpression
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
      const mixinExpression = ctx.finalStyleObject[uniqueId] ? [{
        node: t.stringLiteral(uniqueId)
      }] : []
      // 临时方案: 暂不考虑动态、非动态的样式优先级
      const activeExpressionArray = activeClassName.concat(activeId).concat(mixinExpression)

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
