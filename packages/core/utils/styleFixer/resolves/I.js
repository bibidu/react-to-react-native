module.exports = function({path, ctx, t, constant, addUsingComponent}) {
  let uniqueId

  function getBgUrlPathAst(path, activeBgUrlValue) {
    const uniqueIdPath = ctx.jsxUtils.getJSXAttributeValue(path, ctx.enums.UNIQUE_ID)
    uniqueId = uniqueIdPath.node.value

    const staticBgUrlPath = ctx.externalToInlineStyle[uniqueId][ctx.enums.MIDWAY_BGURL]
    // console.log(ctx.cssObject.stableClassNames);
    const isHttpOrHttps = (path) => /^(http|https)\:/.test(path)
    
    if (activeBgUrlValue) {
      // TODO: add 动态bgUrl
  
    } else {
      // 静态bgUrl
      if (staticBgUrlPath) {
        if (isHttpOrHttps(staticBgUrlPath)) {
          return t.StringLiteral(staticBgUrlPath)
        } else {
          if (!staticBgUrlPath.startsWith('.')) {
            ctx.warnings.add(`暂不支持background-url路径以非.开头_${staticBgUrlPath}`)
          }
          const path = require('path')
          const requirePath = path.resolve(path.dirname(ctx.currentCompilePath), staticBgUrlPath)
          ctx.copyResources.add(requirePath)
      
          return t.CallExpression(
            t.identifier('require'),
            [
              t.StringLiteral(staticBgUrlPath)
            ]
          )
        }
      }
    }
  }

  const bgUrlPathAst = getBgUrlPathAst(path)

  if (!bgUrlPathAst) {
    return
  }

  const attrValueIsAst = t.JSXExpressionContainer(
    t.CallExpression(
      t.MemberExpression(
        t.identifier(ctx.enums.RNUTILS_USE_NAME),
        t.identifier(ctx.enums.IMG_POLYFILL_FUNC),
      ),
      [
        bgUrlPathAst
      ]
    )
  )
  // 添加运行时使用到的工具方法名
  ctx.addRuntimeUseUtil(ctx.enums.IMG_POLYFILL_FUNC)

  ctx.jsxUtils.addJSXAttribute(path, 'source', attrValueIsAst, { attrValueIsAst: true })
  
  // 替换标签名
  path.get('openingElement.name').replaceWith(t.JSXIdentifier('Image'))
  if (path.get('closingElement')) {
    path.get('closingElement.name').replaceWith(t.JSXIdentifier('Image'))
  }
  
  // 删除backgroundUrl中间变量
  delete ctx.convertedStyleToRN.exceptInherit[uniqueId][ctx.enums.MIDWAY_BGURL]

  addUsingComponent('Image')
}