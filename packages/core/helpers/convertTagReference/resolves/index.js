const style = require('./style')

const constant = {
  tapEvents: [
    'onClick',
    'onChange',
  ],
  mapViewTags: [
    'div',
  ],
  mapTextTags: [
    'span'
  ]
}

module.exports = function resolves({
  path,
  t,
  ctx,
}) {

  function addEventPolyfill(path, eventName) {
    const createEventTargetPolyfill = (value) => (
      t.CallExpression(
        t.MemberExpression(
          t.identifier(ctx.enums.RNUTILS_USE_NAME),
          t.identifier(ctx.enums.EVENT_TARGET_FUNC),
        ),
        [
          t.identifier(value)
        ]
      )
    )

    const eventValue = ctx.jsxUtils.getJSXAttributeValue(path, eventName)
    if (!eventValue) return
    
    if (eventValue.isJSXExpressionContainer()) {
      const expression = eventValue.get('expression')
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
  }

  // 标签名
  const tagName = path.get('openingElement').get('name').node.name
  // 是否有tap事件
  const hasTapEvent = constant.tapEvents.some(eventName =>
    ctx.jsxUtils.getJSXAttributeValue(path, eventName)
  )
  
  function resolve(newTagName, hasExtraAction) {
    if (hasExtraAction) {
      // extraAction：对节点进行（除替换标签名、替换事件名）额外的操作，如添加新的子节点
      require(`./extraAction/${newTagName}`)({
        path,
        t,
        ctx,
        constant,
      })
    }
    return {
      tag: newTagName,
      styles: style(tagName),
    }
  }

  /*************** 映射的规则 ***************/

  // 替换所有点击事件
  ctx.jsxUtils.replaceJSXAttributeKey(path, 'onClick', 'onPress')

  // 所有事件polyfill
  constant.tapEvents.forEach(event => addEventPolyfill(path, event))

  if (hasTapEvent) {
    return resolve('TouchableOpacity', true)
  }

  if (tagName === 'img') {
    return resolve('Image', true)
  }

  if (tagName === 'textarea') {
    return resolve('TextInput', true)
  }

  if (constant.mapViewTags.includes(tagName)) {
    return resolve('View')
  }

  if (constant.mapTextTags.includes(tagName)) {
    return resolve('Text')
  }

  return resolve('View')
}
