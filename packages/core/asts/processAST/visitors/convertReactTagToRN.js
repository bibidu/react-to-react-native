// 是否是用户自定义组件
const isComponent = (tagName) => tagName.charAt(0) !== tagName.charAt(0).toLowerCase()

// 收集使用到的React Native组件
function collectRNUsingComponentName(ctx, tagName) {
  ctx.addUsingRNComponentName(tagName)
}

// 替换标签名
function replaceTagName(path, t, newTagName) {
  const newTagPath = t.JSXIdentifier(newTagName)
  path.get('openingElement').get('name').replaceWith(newTagPath)
  path.get('closingElement').get('name').replaceWith(newTagPath)
}

// 保存标签自带样式
function saveStyleFromTagName(path, ctx, styles) {
  if (Object.keys(styles).length) {
    const uniqueId = ctx.jsxUtils.getJSXAttributeValue(path, ctx.enums.UNIQUE_ID)
    if (!uniqueId || !uniqueId.node || !uniqueId.node.value) {
      ctx.error('不存在uniqueId')
    }
    ctx.addUniqueTagStyle(uniqueId.node.value, styles)
  }
}

module.exports = function convertReactTagToRN({ ctx, t }) {
  
  function replacement(path) {
    const tagName = path.get('openingElement').get('name').node.name
    if (isComponent(tagName)) return

    function _replacement() {
      switch (tagName) {
        case 'div': {
          return {
            tag: 'View'
          }
        }

        default: {
          return {
            tag: 'View'
          }
        }
      }
    }
    const { tag, styles = {} } = _replacement()

    collectRNUsingComponentName(ctx, tag)
    replaceTagName(path, t, tag)
    saveStyleFromTagName(path, ctx, styles)
  }

  return {
    JSXElement(path) {
      replacement(path)
    }
  }
}

