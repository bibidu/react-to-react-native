module.exports = function addStyleAccordingToUniqueId({ ctx, t }) {

  function createRuntimeUtilWrapper({ utilName, childNode }) {
    const {
      RNUTILS_USE_NAME,
    } = ctx.enums

    return t.CallExpression(
      // 'utils.omit()' or 'utils.extend()'
      t.MemberExpression(
        t.identifier(RNUTILS_USE_NAME),
        t.identifier(utilName),
      ),
      [childNode]
    )
  }

  // function createDynamicStyle(uniqueId) {
  //   const {
  //     STYLESHEET_NAME,
  //     OMIT_CAN_INHERIT_STYLE_NAME_FUNC,
  //     EXTRACT_CAN_INHERIT_STYLE_NAME_FUNC,
  //   } = ctx.enums
  //   const isTextNode = ctx.distTagName[uniqueId] === 'Text'

  //   const { activeClassName, activeId, activeStyle = [] } = ctx.uniqueNodeInfo[uniqueId]
  //   const styleNodes = []
    
  //   // 2. activeClass activeId inline
  //   ;[].concat(
  //     activeClassName,
  //     activeId,
  //     activeStyle
  //   ).forEach(node => {
  //     ctx.warnings.add(`动态样式中可能存在RN不支持的属性，需自行检查并删除`)

  //     let expressionNode
  //     if (node.type.endsWith('Expression')) {
  //       expressionNode = node
  //     } else {
  //       expressionNode = t.MemberExpression(
  //         t.identifier(STYLESHEET_NAME),
  //         node,
  //         true
  //       )
  //     }
  //     const utilName = isTextNode ? OMIT_CAN_INHERIT_STYLE_NAME_FUNC : EXTRACT_CAN_INHERIT_STYLE_NAME_FUNC
  //     styleNodes.push(
  //       createRuntimeUtilWrapper({
  //         utilName,
  //         childNode: expressionNode,
  //       })
  //     )
  //     ctx.addRuntimeUseUtil(utilName)
  //   })
    
  //   if (!styleNodes.length) {
  //     return null
  //   }

  //   return (
  //     t.JSXAttribute(
  //       t.JSXIdentifier('style'),
  //       t.jsxExpressionContainer(
  //         styleNodes.length === 1 ? styleNodes[0] : t.ArrayExpression(styleNodes)
  //       )
  //     )
  //   )
  // }

  function createFinalStyleAst(uniqueId) {
    const styleArrayNodes = []
    const { canInheritStyleName } = ctx.constants
    const {
      STYLESHEET_NAME,
      OMIT_CAN_INHERIT_STYLE_NAME_FUNC,
      EXTRACT_CAN_INHERIT_STYLE_NAME_FUNC,
    } = ctx.enums
    const isTextNode = ctx.distTagName[uniqueId] === 'Text'

    // <!----------------- 继承style start----------------->

    if (isTextNode) {
      const inheritStyle = ctx.inheritStyle[uniqueId] || {}
      if (Object.keys(inheritStyle).length) {
        const id = ctx.utils.generateId('inherit')
        ctx.addGenerateStyle(id, inheritStyle)
  
        styleArrayNodes.push(
          t.MemberExpression(
            t.identifier(ctx.enums.STYLESHEET_NAME),
            t.identifier(id),
          )
        )
      }
    }

    // <!----------------- 继承style start----------------->

    // <!----------------- 静态混合(标签样式 + class/id样式 + 内联样式) start----------------->

    let styleObject = ctx.convertedStyleToRN[uniqueId]
    styleObject = ctx.utils[isTextNode ? 'extract' : 'omit'](styleObject, canInheritStyleName)
    if (Object.keys(styleObject).length) {
      const id = ctx.utils.generateId('merge')
      ctx.addGenerateStyle(id, styleObject)

      styleArrayNodes.push(
        t.MemberExpression(
          t.identifier(ctx.enums.STYLESHEET_NAME),
          t.identifier(id),
        )
      )
    }
    delete ctx.convertedStyleToRN[uniqueId] /* 通过新生成stylesheet替换 */

    // <!----------------- 静态混合(标签样式 + class/id样式 + 内联样式) end----------------->
    
    // <!----------------- 动态(class样式 + id样式 + 内联样式) start----------------->

    const { activeClassName, activeId, activeStyle = [] } = ctx.uniqueNodeInfo[uniqueId]
    ;[].concat(
      activeClassName,
      activeId,
      activeStyle
    ).forEach(node => {
      ctx.warnings.add(`动态样式中可能存在RN不支持的属性，需自行检查并删除`)

      let expressionNode
      if (node.type.endsWith('Expression')) {
        expressionNode = node
      } else {
        expressionNode = t.MemberExpression(
          t.identifier(STYLESHEET_NAME),
          node,
          true
        )
      }
      const utilName = isTextNode ? OMIT_CAN_INHERIT_STYLE_NAME_FUNC : EXTRACT_CAN_INHERIT_STYLE_NAME_FUNC
      styleArrayNodes.push(
        createRuntimeUtilWrapper({
          utilName,
          childNode: expressionNode,
        })
      )
      ctx.addRuntimeUseUtil(utilName)
    })

    // <!----------------- 动态(class样式 + id样式 + 内联样式) end----------------->
    
    if (!styleArrayNodes.length) return null
    
    return t.JSXAttribute(
      t.JSXIdentifier('style'),
      t.jsxExpressionContainer(
        styleArrayNodes.length === 1 ? styleArrayNodes[0] : t.arrayExpression(styleArrayNodes)
      )
    )
  }

  return {
    JSXElement(path) {
      const uniqueIdPrefix = ctx.enums.UNIQUE_ID
      const uniqueIdPath = ctx.jsxUtils.getJSXAttributeValue(path, uniqueIdPrefix)
      const uniqueId = uniqueIdPath.node.value

      // const { isActive } = ctx.uniqueNodeInfo[uniqueId]
      
      // let styleNode
      // if (isActive) {
      //   styleNode = createDynamicStyle(uniqueId)
      // } else {
      //   styleNode = createFinalStyleAst(uniqueId)
      // }
      const styleNode = createFinalStyleAst(uniqueId)

      if (styleNode) {
        path.get('openingElement').pushContainer(
          'attributes',
          styleNode
        )
      }
    }
  }
}
