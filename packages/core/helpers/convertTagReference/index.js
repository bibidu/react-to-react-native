const t = require('@babel/types')
const traverse = require('@babel/traverse').default
const resolves = require('./resolves')

let ctx

function replaceTagName(path, t, newTagName) {
  const newTagPath = t.JSXIdentifier(newTagName)
  path.get('openingElement').get('name').replaceWith(newTagPath)
  if (path.get('closingElement').isJSXClosingElement()) {
    path.get('closingElement').get('name').replaceWith(newTagPath)
  }
}

function saveStyleFromTagName(path, styles) {
  if (Object.keys(styles).length) {
    const uniqueId = ctx.jsxUtils.getJSXAttributeValue(path, ctx.enums.UNIQUE_ID)
    if (!uniqueId || !uniqueId.node || !uniqueId.node.value) {
      ctx.error('不存在uniqueId')
    }
    ctx.addTagSelfStyle(uniqueId.node.value, styles)
  }
}

function saveDistTagName(path, tag) {
  const uniqueIdPath = ctx.jsxUtils.getJSXAttributeValue(path, ctx.enums.UNIQUE_ID)
  const uniqueId = uniqueIdPath.node.value
  ctx.addDistTagName(uniqueId, tag)
}

module.exports = function convertTagReference(ast, {
  addUsingComponent,
}) {
  ctx = this

  function replacement(path) {
    const tagName = ctx.jsxUtils.getTagName(path)
    if (ctx.isUserComponent(tagName)) return

    const { tag, styles = {} } = resolves({path, t, ctx})
    
    addUsingComponent(tag) // 收集使用到的React Native组件
    replaceTagName(path, t, tag) // 替换标签名
    saveStyleFromTagName(path, styles) // 保存标签自带样式
    saveDistTagName(path, tag) // 保存当前元素的输出标签
  }

  return traverse(ast, {
    JSXElement(path) {
      replacement(path)
    }
  })
}

