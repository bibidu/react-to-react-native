module.exports = function addStyleAccordingToUniqueId({ ctx, t }) {
  const key = ctx.enums.ACTIVE_CLASSNAME_WILL_REPLACEBY_STYLESHEET

  function createArrayCallInJSXExpression({
    activeExpressionArray, // 动态属性
    inheritActiveClassNameAst, // 继承而来的父级所有属性(需要去除不能继承的属性，如父级的border等)
  }) {
    const notInheritStylesheetAst = activeExpressionArray.map(item => (
      t.MemberExpression(
        t.identifier(ctx.enums.STYLESHEET_NAME),
        item.node,
        true
      )
    ))

    const inheritStylesheetAst = inheritActiveClassNameAst.map(item => (
      t.CallExpression(
        t.MemberExpression(
          t.identifier(ctx.enums.RNUTILS_USE_NAME),
          t.identifier(ctx.enums.EXTRACT_FUNC)
        ),
        [
          t.MemberExpression(
            t.identifier(ctx.enums.STYLESHEET_NAME),
            activeExpressionArray[0].node,
            true
          ),
          // 可继承的css属性名
          t.MemberExpression(
            t.identifier(ctx.enums.RNUTILS_USE_NAME),
            t.identifier(ctx.enums.CAN_INHERIT_STYLE_NAMES),
          )
        ]
      )
    ))

    const mixinsArray = notInheritStylesheetAst.concat(inheritStylesheetAst)

    return t.jsxExpressionContainer(
      mixinsArray.length === 1 ? mixinsArray[0] : t.ArrayExpression(mixinsArray)
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
      const activeExpressionArray = activeClassName.concat(activeId).concat(mixinExpression)
      
      // 自定义组件hasStyleValue为false，直接跳过(不在自定义组件上定义style，如<Table style={xxx} />)
      const hasStyleValue = Boolean(Object.keys(finalStyle).length)
      // 拥有继承而来的属性或本身有属性
      if (inheritActiveClassNameAst.length || hasStyleValue) {
        const attributeValuePath = createArrayCallInJSXExpression({
          activeExpressionArray,
          inheritActiveClassNameAst,
        })
        const jsxAttributePath = t.JSXAttribute(
          t.JSXIdentifier('style'),
          attributeValuePath
        )
        path.get('openingElement').pushContainer('attributes', jsxAttributePath)
      }
    }
  }
}
