const resolves = require('./resolves')

const isComponent = (tagName) => tagName.charAt(0) !== tagName.charAt(0).toLowerCase()

function collectRNUsingComponentName(ctx, tagName) {
  ctx.addUsingRNComponentName(tagName)
}

function replaceTagName(path, t, newTagName) {
  const newTagPath = t.JSXIdentifier(newTagName)
  path.get('openingElement').get('name').replaceWith(newTagPath)
  path.get('closingElement').get('name').replaceWith(newTagPath)
}

function saveStyleFromTagName(path, ctx, styles) {
  if (Object.keys(styles).length) {
    const uniqueId = ctx.jsxUtils.getJSXAttributeValue(path, ctx.enums.UNIQUE_ID)
    if (!uniqueId || !uniqueId.node || !uniqueId.node.value) {
      ctx.error('不存在uniqueId')
    }
    ctx.addTagSelfStyle(uniqueId.node.value, styles)
  }
}

module.exports = function convertReactTagToRN({ ctx, t }) {
  function replacement(path) {
    const tagName = path.get('openingElement').get('name').node.name
    if (isComponent(tagName)) return

    const { tag, styles = {} } = resolves({path, t, ctx})
    
    collectRNUsingComponentName(ctx, tag) // 收集使用到的React Native组件
    replaceTagName(path, t, tag) // 替换标签名
    saveStyleFromTagName(path, ctx, styles) // 保存标签自带样式
  }

  return {
    JSXElement(path) {
      replacement(path)
    }
  }
}

