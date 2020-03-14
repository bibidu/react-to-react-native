module.exports = function({path, ctx, t, constant}) {
  ctx.jsxUtils.replaceJSXAttributeKey(path, 'onChange', 'onChangeText')
  ctx.jsxUtils.removeJSXAttributeByKey(path, [
    'id',
    'cols',
    'rows',
    'name',
  ])
  ctx.jsxUtils.addJSXAttribute(
    path,
    'multiline',
    t.JSXExpressionContainer(
      t.BooleanLiteral(true)
    ).node,
    {
      attrValueIsAst: true,
    }
  )
}