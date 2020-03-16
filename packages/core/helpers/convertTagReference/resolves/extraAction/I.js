module.exports = function({path, ctx, t, constant}) {

  function getBgUrlPathAst(path, activeBgUrlValue) {
    const uniqueIdPath = ctx.jsxUtils.getJSXAttributeValue(path, ctx.enums.UNIQUE_ID)
    const uniqueId = uniqueIdPath.node.value

    const staticBgUrlPath = ctx.externalToInlineStyle[uniqueId]['backgroundUrl']
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

  function getBgUrlValue(bgUrlAttr) {
    let activeBgUrlValue = ''
    if (!bgUrlAttr.isStringLiteral()) {
      const errorMsg = `${ctx.enums.BGURL_ATTR_MARK}的属性值只支持String类型, 如${ctx.enums.BGURL_ATTR_MARK}="activePath"`
      ctx.errors.add(errorMsg)
      ctx.error(errorMsg)
    } else {
      activeBgUrlValue = bgUrlAttr.node.value
    }
    return activeBgUrlValue
  }

  // const bgUrlAttr = ctx.jsxUtils.getJSXAttributeValue(path, ctx.enums.BGURL_ATTR_MARK)

  // if (bgUrlAttr) {
  // const activeBgUrlValue = getBgUrlValue(bgUrlAttr)
  // const bgUrlPathAst = getBgUrlPathAst(path, activeBgUrlValue)
  const bgUrlPathAst = getBgUrlPathAst(path)

  if (!bgUrlPathAst) {
    return {
      tag: 'View',
      styles: {}
    }
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
  ctx.jsxUtils.addJSXAttribute(path, 'source', attrValueIsAst, { attrValueIsAst: true })
  
  return {
    tag: 'Image',
    styles: {}
  }
  // } else {
  //   return {
  //     tag: 'View',
  //     styles: {}
  //   }
  // }
}