module.exports = function collectInfo({ ctx, t }) {
  return {
    ExportDefaultDeclaration(path) {
      const { name } = path.get('declaration').node
      // 收集导出的组件名
      ctx.collections.exports.push(name)
    },

    JSXElement(path) {
      const styleAttr = ctx.getJSXAttribute(path, 'style')
      if (styleAttr) {
        // 暂只支持style={{[string]: string | any}}内联样式
        const isExpression = styleAttr.isJSXExpressionContainer()
        const isObjectExpression = isExpression && styleAttr.get('expression').isObjectExpression()
        if (isObjectExpression) {
          const objStyle = ctx.astUtils.objAstToObj(styleAttr.get('expression'))
          const uniqueIdPrefix = ctx.getUniqueIdPrefix()
          const uniqueId = ctx.getJSXAttribute(path, uniqueIdPrefix)
          ctx.addInitialInlineStyle(uniqueId.node.value, objStyle)
        }
      }
    }
  }
}


