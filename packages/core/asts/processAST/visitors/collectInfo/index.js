
module.exports = function collectInfo({ ctx, t }) {
  const visitor = {}

  Object.assign(visitor, {
    ImportDeclaration(path) {
      // 收集import xxx from 'react'并在转译时移除
      const isReactImport = path.get('source').isStringLiteral({ value: 'react' })
      if (isReactImport) {
        ctx.collections.importReactPath[ctx.currentCompilePath] = path.node
        path.remove()
      }
    },

    ExportDefaultDeclaration(path) {
      let name
      const declaration = path.get('declaration')
      if (declaration.isIdentifier()) {
        name = declaration.node.name
      } else if (declaration.isClassDeclaration() && declaration.get('id').isIdentifier()) {
        name = declaration.get('id').node.name
      }
      // 收集导出的组件名
      console.log(`正在编译的组件路径 ${ctx.currentCompilePath}`)
      ctx.collections.exports[ctx.hashHelper(ctx.currentCompilePath)] = name
    },

    JSXElement(path) {
      const styleAttr = ctx.jsxUtils.getJSXAttributeValue(path, 'style')
      if (styleAttr) {
        const isExpression = styleAttr.isJSXExpressionContainer()
        const isObjectExpression = isExpression && styleAttr.get('expression').isObjectExpression()
        // 1. style={{[string]: string | any}}内联样式。
        if (isObjectExpression) {
          const objStyle = ctx.astUtils.objAstToObj(styleAttr.get('expression'))
          const uniqueIdPrefix = ctx.enums.UNIQUE_ID
          const uniqueId = ctx.jsxUtils.getJSXAttributeValue(path, uniqueIdPrefix)
          ctx.addInitialInlineStyle(uniqueId.node.value, objStyle)
        }
        // 2. 形如style={obj}, 暂不支持(需要逐级向父级查找)
        // 删除style属性
        ctx.jsxUtils.getJSXAttribute(path, 'style').remove()
      }
    },
  })

  return visitor
}


