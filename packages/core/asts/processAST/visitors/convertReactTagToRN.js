module.exports = function convertReactTagToRN({ ctx, t }) {
  function replaceAndSaveTagStyle(path) {
    const tagNamePath = path.get('openingElement').get('name')
    const { tag, styles } = getRNTagMappingFromHtml(tagNamePath.node.name)

    // 收集使用到的React Native组件
    ctx.addUsingRNComponentName(tag)

    // 替换标签
    const newTagPath = t.JSXIdentifier(tag)
    tagNamePath.replaceWith(newTagPath)
    path.get('closingElement').get('name').replaceWith(newTagPath)

    // 保存标签自带样式
    if (Object.keys(styles).length) {
      const uniqueId = ctx.jsxUtils.getJSXAttributeValue(path, ctx.getUniqueIdPrefix())
      if (!uniqueId || !uniqueId.node || !uniqueId.node.value) {
        ctx.error('不存在uniqueId')
      }
      ctx.addUniqueTagStyle(uniqueId.node.value, styles)
    }
  }

  return {
    JSXElement(path) {
      replaceAndSaveTagStyle(path)
    }
  }
}

function getRNTagMappingFromHtml(tagName) {
  const mapping = { tag: '', styles: { color: '#fff' } }
  switch(tagName) {
    case 'div': {
      mapping.tag = 'View'
      break
    }

    case 'span': {
      mapping.tag = 'Text'
      break
    }

    default: {
      mapping.tag = 'View'
    }
  }
  
  return mapping
}
