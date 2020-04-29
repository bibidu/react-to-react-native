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

  function createDynamicStyle(uniqueId) {
    const {
      STYLESHEET_NAME,
      OMIT_CAN_INHERIT_STYLE_NAME_FUNC,
      EXTRACT_CAN_INHERIT_STYLE_NAME_FUNC,
    } = ctx.enums
    const isTextNode = ctx.distTagName[uniqueId] === 'Text'

    const { activeClassName, activeId, activeStyle = [] } = ctx.uniqueNodeInfo[uniqueId]
    const styleNodes = []
    
    // external < activeClass < activeId < inline
    // 1. external
    const hasValidExternalStyle = Boolean(ctx.externalToInlineStyle[uniqueId])
    hasValidExternalStyle && styleNodes.push(
      t.MemberExpression(
        t.identifier(STYLESHEET_NAME),
        t.identifier(uniqueId),
      )
    )
    // 2. activeClass activeId inline
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
      styleNodes.push(
        createRuntimeUtilWrapper({
          utilName,
          childNode: expressionNode,
        })
      )
      ctx.addRuntimeUseUtil(utilName)
    })
    
    if (!styleNodes.length) {
      return null
    }

    return (
      t.JSXAttribute(
        t.JSXIdentifier('style'),
        t.jsxExpressionContainer(
          styleNodes.length === 1 ? styleNodes[0] : t.ArrayExpression(styleNodes)
        )
      )
    )
  }

  function createStaticStyle(uniqueId,styleObject) {
    const { canInheritStyleName } = ctx.constants
    const isTextNode = ctx.distTagName[uniqueId] === 'Text'

    const {
      extract,
      omit,
    } = ctx.utils
    if (isTextNode) {
      styleObject = extract(styleObject, canInheritStyleName)
    } else {
      styleObject = omit(styleObject, canInheritStyleName)
    }

    if (!Object.keys(styleObject).length) return null

    return t.JSXAttribute(
      t.JSXIdentifier('style'),
      t.jsxExpressionContainer(
        t.MemberExpression(
          t.identifier(ctx.enums.STYLESHEET_NAME),
          t.identifier(uniqueId),
        )
      )
    )
  }

  return {
    JSXElement(path) {
      const uniqueIdPrefix = ctx.enums.UNIQUE_ID
      const uniqueIdPath = ctx.jsxUtils.getJSXAttributeValue(path, uniqueIdPrefix)
      const uniqueId = uniqueIdPath.node.value

      const { isActive } = ctx.uniqueNodeInfo[uniqueId]
      const styleObject = ctx.convertedStyleToRN[uniqueId]
      
      let styleNode
      if (isActive) {
        styleNode = createDynamicStyle(uniqueId)
      } else {
        styleNode = createStaticStyle(uniqueId,styleObject)
      }

      if (styleNode) {
        path.get('openingElement').pushContainer(
          'attributes',
          styleNode
        )
      }
    }
  }
}
