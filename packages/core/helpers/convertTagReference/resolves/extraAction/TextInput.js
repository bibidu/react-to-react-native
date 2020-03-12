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

  const onChangeValue = ctx.jsxUtils.getJSXAttributeValue(path, 'onChange')
  if (onChangeValue.isJSXExpressionContainer()) {
    const expression = onChangeValue.get('expression')
    if (expression.isArrowFunctionExpression()) {
      if (expression.get('body').isCallExpression()) {
        // onChange={e => this.inputEvent(e)}
        // onChange={e => this.inputEvent(e)({ z: e })}
        // onChange={e => this.changeInput(e, { t: e })}
        const sourceE = expression.get('params.0')
        expression.get('body').traverse({
          Identifier(_path) {
            if (_path.isIdentifier({ name: sourceE.node.name })) {
              _path.replaceWith(
                createEventTargetPolyfill('e')
              )
              _path.skip()
            }
          }
        })
      }
    } else if (expression.isMemberExpression()) {
      // onChange={this.inputEvent}
      expression.replaceWith(
        t.ArrowFunctionExpression(
          [
            t.identifier('e')
          ],
          t.CallExpression(
            expression.node,
            [
              createEventTargetPolyfill('e')
            ]
          )
        )
      )
    }
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