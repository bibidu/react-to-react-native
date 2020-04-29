const style = require('./style')

const constant = {
  tapEvents: [
    'onClick',
    'onChange',
    'onBlur',
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
    const createEventTargetPolyfill = (value) => {
      ctx.addRuntimeUseUtil(ctx.enums.EVENT_TARGET_FUNC)
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

    const eventValue = ctx.jsxUtils.getJSXAttributeValue(path, eventName)
    if (!eventValue) return
    
    if (eventValue.isJSXExpressionContainer()) {
      const expression = eventValue.get('expression')
      if (expression.isArrowFunctionExpression() || expression.isFunctionExpression()) {
        // onChange={e => this.inputEvent(e)}
        // onChange={e => this.inputEvent(e)({ z: e })}
        // onChange={e => this.changeInput(e, { t: e })}
        // onChange={e => (t) => e + t}
        // onChange={function(e) { e + 1 }}
        const sourceE = expression.get('params.0')
        if (sourceE) {
          expression.get('body').traverse({
            Identifier(_path) {
              if (_path.isIdentifier({ name: sourceE.node.name })) {
                _path.replaceWith(
                  createEventTargetPolyfill(sourceE.node.name)
                )
                _path.skip()
              }
            }
          })
        }
      } else {
        // onChange={this.inputEvent}
        // onChange={inputEvent}
        // onChange={inputEvent(123)}
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
  // 是否有rn-scroll标签
  const hasRNScrollMark = path => {
    const rnScrollMark = ctx.enums['SCROLL_MARK']
    return ctx.jsxUtils.getJSXAttribute(path, rnScrollMark)
  }

  // 是否是Fragment
  const isFragment = path => {
    if (path.isJSXFragment())
      return true

    const nameNode = path.get('openingElement').get('name')
    if (nameNode.isJSXIdentifier({ name: 'Fragment' }))
      return true

    if (nameNode.isJSXMemberExpression() && nameNode.get('property').isJSXIdentifier({ name: 'Fragment' }))
      return true
  }

  function resolve(newTagName, hasExtraAction, options) {
    if (hasExtraAction) {
      // extraAction：对节点进行（除替换标签名、替换事件名）额外的操作，如添加新的子节点
      const value = require(`./extraAction/${newTagName}`)({
        path,
        t,
        ctx,
        constant,
      }, options)

      if (value) return value
    }
    return {
      tag: newTagName,
      styles: style(tagName),
    }
  }

  /*************** 映射的规则 ***************/

  // 所有事件polyfill
  constant.tapEvents.forEach(event => addEventPolyfill(path, event))

  // 替换所有点击事件
  ctx.jsxUtils.replaceJSXAttributeKey(path, 'onClick', 'onPress')

  if (hasRNScrollMark(path)) {
    return resolve('ScrollView', true)
  }

  // Fragment
  if (isFragment(path)) {
    return resolve('', false)
  }

  if (tagName === 'input') {
    return resolve('TextInput', true, { isMultiple: false })
  }

  if (tagName === 'img') {
    return resolve('Image', true)
  }
  
  if (tagName === 'textarea') {
    return resolve('TextInput', true, { isMultiple: true })
  }

  if (hasTapEvent) {
    return resolve('TouchableOpacity', true, { tagName })
  }

  if (constant.mapViewTags.includes(tagName)) {
    return resolve('View')
  }

  if (constant.mapTextTags.includes(tagName)) {
    return resolve('Text')
  }

  return resolve('View')
}
