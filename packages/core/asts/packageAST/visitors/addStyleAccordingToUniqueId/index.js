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

          if (uniqueIdStylesheetAst) ancestorAstArray.push(uniqueIdStylesheetAst)
          if (!ancestorAstArray.length) return null

          return t.CallExpression(
            t.MemberExpression(
              t.identifier(ctx.enums.RNUTILS_USE_NAME),
              t.identifier(ctx.enums.EXTRACT_CAN_INHERIT_STYLE_NAME_FUNC),
            ),
            ancestorAstArray.length === 1 ? ancestorAstArray : [
              // ...[{a: 1}, {a: 2}] => {a: 1}
              t.SpreadElement(
                t.ArrayExpression(ancestorAstArray)
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

      // 临时方案: 暂不考虑动态、非动态的样式优先级
      const activeExpressionArray = activeClassName.concat(activeId).concat(mixinExceptInheritExpression)

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
