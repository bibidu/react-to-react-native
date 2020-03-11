module.exports = function addStyleAccordingToUniqueId({ ctx, t }) {
  const key = ctx.enums.ACTIVE_CLASSNAME_WILL_REPLACEBY_STYLESHEET

  function createArrayCallInJSXExpression({
    activeExpressionArray, // 动态属性
    ancestorStylesheetKey, // 继承而来的父级所有属性(需要去除不能继承的属性，如父级的border等)
  }) {
    const notInheritStylesheetAst = activeExpressionArray.map(item => {
      return (
        t.MemberExpression(
          t.identifier(ctx.enums.STYLESHEET_NAME),
          item.node,
          true
        )
      )
    })
    
    let inheritStylesheetAst = ancestorStylesheetKey.filter(
      ([uniqueId, ancestorAst]) => uniqueId && Array.isArray(ancestorAst)
    )

    const isInheritStylesheetAstValid = Boolean(ancestorStylesheetKey.length) &&
      Boolean(inheritStylesheetAst.length)
    
    if (!isInheritStylesheetAstValid) {
      inheritStylesheetAst = []
    } else {
      inheritStylesheetAst = inheritStylesheetAst
        .map(([uniqueId, activeAncestorAst]) => {
          const ancestorAstArray = activeAncestorAst.map(ast => t.MemberExpression(
            t.identifier(ctx.enums.STYLESHEET_NAME),
            ast.node,
            true
          ))
          const uniqueIdStylesheetAst = uniqueId ? t.MemberExpression(
            t.identifier(ctx.enums.STYLESHEET_NAME),
            t.stringLiteral(uniqueId),
            true
          ) : null

          if (uniqueIdStylesheetAst) ancestorAstArray.unshift(uniqueIdStylesheetAst)
          if (!ancestorAstArray.length) return null

          return t.CallExpression(
            t.MemberExpression(
              t.identifier(ctx.enums.RNUTILS_USE_NAME),
              t.identifier(ctx.enums.EXTRACT_CAN_INHERIT_STYLE_NAME_FUNC),
            ),
            [
              ancestorAstArray.length === 1 ? ancestorAstArray[0] : t.CallExpression(
                t.MemberExpression(
                  t.identifier('Object'),
                  t.identifier('assign'),
                ),
                [
                  t.ObjectExpression([]),
                  ...ancestorAstArray
                ]
              )
            ]
          )
      })
    }

    const mixinsArray = notInheritStylesheetAst.concat(inheritStylesheetAst)
    
    switch(mixinsArray.length) {
      case 0: return null
      case 1: return t.jsxExpressionContainer(mixinsArray[0])
      default: return t.jsxExpressionContainer(t.ArrayExpression(mixinsArray))
    }
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
      
      const {
        exceptInherit, // 除了继承样式的混合结果
      } = ctx.convertedStyleToRN

      const ancestorStylesheetKey = ctx.inheritStyle[uniqueId] || []
      
      if (!activeClassName) activeClassName = []
      if (!activeId) activeId = []
      
      const mixinExceptInheritExpression = exceptInherit[uniqueId] ? [{
        node: t.stringLiteral(uniqueId)
      }] : []

      // TODO: update 当前方案是将动态样式放在最后，处于高优先级。
      // （原因是react样式可运行时计算，当前rn的样式处理为编译时计算，如果改成运行时计算，会造成最终样式过长。）
      const activeExpressionArray = mixinExceptInheritExpression.concat(activeClassName.concat(activeId))

      // 拥有继承而来的属性或本身有属性
      if (ancestorStylesheetKey.length || activeExpressionArray.length) {
        const attributeValuePath = createArrayCallInJSXExpression({
          activeExpressionArray,
          ancestorStylesheetKey,
        })

        if (attributeValuePath) {
          const jsxAttributePath = t.JSXAttribute(
            t.JSXIdentifier('style'),
            attributeValuePath
          )
          path.get('openingElement').pushContainer('attributes', jsxAttributePath)
        }
      }
    }
  }
}
