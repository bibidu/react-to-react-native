module.exports = function addStyleAccordingToUniqueId({ ctx, t }) {
  const key = ctx.enums.ACTIVE_CLASSNAME_WILL_REPLACEBY_STYLESHEET

  function createArrayCallInJSXExpression(activeExpressionArray) {
    const singleExpression = t.MemberExpression(
      t.identifier(ctx.enums.STYLESHEET_NAME),
      activeExpressionArray[0].node,
      true
    )

    const multiExpression = t.ArrayExpression(
      activeExpressionArray.map(expression => (
        t.MemberExpression(
          t.identifier(ctx.enums.STYLESHEET_NAME),
          expression.node,
          true
        )
      ))
    )

    return t.jsxExpressionContainer(
      activeExpressionArray.length === 1 ? singleExpression : multiExpression
    )
  }

  return {
    JSXElement(path) {
      const tagName = path.get('openingElement').get('name').node.name
      const uniqueIdPrefix = ctx.enums.UNIQUE_ID
      const uniqueIdPath = ctx.jsxUtils.getJSXAttributeValue(path, uniqueIdPrefix)
      const uniqueId = uniqueIdPath.node.value

      let {
        activeClassName,
        activeId,
      } = ctx.uniqueNodeInfo[uniqueId]
      const finalStyle = ctx.finalStyleObject[uniqueId] || {}

      if (!activeClassName) activeClassName = []
      if (!activeId) activeId = []
      
      const mixinExpression = finalStyle ? [{
        node: t.stringLiteral(uniqueId)
      }] : []

      const inheritActiveClassNameAst = key in finalStyle ? finalStyle[key] : []
      delete finalStyle[key]

      // 临时方案: 暂不考虑动态、非动态的样式优先级
      const activeExpressionArray = activeClassName.concat(activeId).concat(mixinExpression).concat(inheritActiveClassNameAst)
      
      // 自定义组件直接跳过(不在自定义组件上定义style，如<Table style={xxx} />)
      const hasStyleValue = Boolean(Object.keys(finalStyle).length)
      if (hasStyleValue && activeExpressionArray.length) {
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
