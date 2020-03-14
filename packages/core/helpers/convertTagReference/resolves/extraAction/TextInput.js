module.exports = function({path, ctx, t, constant}) {

  function createEventTargetPolyfill(value) {
    return t.CallExpression(
      t.MemberExpression(
        t.identifier(ctx.enums.RNUTILS_USE_NAME),
        t.identifier(ctx.enums.EVENT_TARGET_FUNC),
      ),
      [
        t.identifier(value)
      ]
    )
  }

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