module.exports = function({path, ctx, t, constant}, options) {
  ctx.jsxUtils.replaceJSXAttributeKey(path, 'onChange', 'onChangeText')
  ctx.jsxUtils.removeJSXAttributeByKey(path, [
    'id',
    'cols',
    'rows',
    'name',
  ])
  if (options.isMultiple) {
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
}