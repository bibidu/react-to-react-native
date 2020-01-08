const isCSSPath = (value) => /(css|scss)(\;*)$/.test(value)

module.exports = function collectInfo({ ctx, t }) {
  const visitor = {}

  // node环境，读取css目录并转为cssString
  if (!process.env.COMPILE_ENV || process.env.COMPILE_ENV === 'node') {
    const fs = require('fs')
    const path = require('path')
    visitor.ImportDeclaration = (p) => {
      if (p.get('source').isStringLiteral()) {
        const maybeCssPath = p.get('source').node.value
        if (isCSSPath(maybeCssPath)) {
          const cssAbsolutePath = path.resolve(path.dirname(ctx.reactCompPath), maybeCssPath)
          const cssString = fs.readFileSync(cssAbsolutePath, 'utf8')
          ctx.addCssString(cssAbsolutePath, cssString)
        }
      }
    }
  }

  Object.assign(visitor, {
    ExportDefaultDeclaration(path) {
      const { name } = path.get('declaration').node
      // 收集导出的组件名
      ctx.collections.exports.push(name)
    },

    JSXElement(path) {
      const styleAttr = ctx.jsxUtils.getJSXAttributeValue(path, 'style')
      if (styleAttr) {
        // 1. style={{[string]: string | any}}内联样式
        const isExpression = styleAttr.isJSXExpressionContainer()
        const isObjectExpression = isExpression && styleAttr.get('expression').isObjectExpression()
        if (isObjectExpression) {
          const objStyle = ctx.astUtils.objAstToObj(styleAttr.get('expression'))
          const uniqueIdPrefix = ctx.enums.UNIQUE_ID
          const uniqueId = ctx.jsxUtils.getJSXAttributeValue(path, uniqueIdPrefix)
          ctx.addInitialInlineStyle(uniqueId.node.value, objStyle)
        }
        // 删除style属性
        ctx.jsxUtils.getJSXAttribute(path, 'style').remove()
      }
    },
  })

  return visitor
}


