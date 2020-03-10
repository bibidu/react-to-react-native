module.exports = function({path, ctx, t, constant}) {
  const srcAttrValue = ctx.jsxUtils.getJSXAttributeValue(path, 'src')
  if (srcAttrValue.isStringLiteral()) {
    srcAttrValue.replaceWith(
      t.JSXExpressionContainer(
        ctx.astUtils.objToObjAst({ uri: srcAttrValue.node.value })
      )
    )
  } else if (srcAttrValue.isJSXExpressionContainer()) {
    srcAttrValue.replaceWith(
      t.JSXExpressionContainer(
        t.ObjectExpression(
          [
            t.ObjectProperty(
              t.identifier('uri'),
              srcAttrValue.get('expression').node
            )
          ]
        )
      )
    )
  }
  ctx.jsxUtils.replaceJSXAttributeKey(path, 'src', 'source')
}