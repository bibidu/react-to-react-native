const style = require('./style')

const constant = {
  tapEvents: [
    'onClick',
  ],
  mapViewTags: [
    'div',
  ],
  mapTextTags: [
    'span'
  ]
}

module.exports = function resolves({path, t, ctx}) {
  // 标签名
  const tagName = path.get('openingElement').get('name').node.name
  // 是否有tap事件
  const hasTapEvent = constant.tapEvents.some(eventName =>
    ctx.jsxUtils.getJSXAttributeValue(path, eventName)
  )
  /**
   * 
   * @param {*} newTagName
   * @param {*}  rawTagName
   */
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