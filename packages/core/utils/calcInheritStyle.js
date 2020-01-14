const t = require('@babel/types')
const traverse = require('@babel/traverse').default
const gen = require('@babel/generator').default

const textNames = [
  'Text',
]

const canInheritStyle = [
  'line-height',
  'color',
  'font-size',
]

module.exports = function calcInheritStyle({
  styleExceptInherit,
  afterProcessAST,
}) {
  const isTextNode = (path) => {
    const tagPath = path.get('openingElement').get('name')
    const tagName = tagPath.node.name
    if (textNames.includes(tagName)) {
      return true
    }
  }

  const uniqueIdPrefix = this.enums.UNIQUE_ID
  const getUniqueIdStr = (path) => {
    const uniqueIdPath = this.jsxUtils.getJSXAttributeValue(path, uniqueIdPrefix)
    const uniqueId = uniqueIdPath.node.value
    return uniqueId
  }
  const inheritStyle = {}

  traverse(afterProcessAST, {
    JSXElement(path) {
      if (isTextNode(path)) {
        const parentsStyle = []
        let parent = getCanInheritParent(path)
        while (!parent.isProgram()) {
          const uniqueId = getUniqueIdStr(parent)
          const style = styleExceptInherit[uniqueId]
          if (style) {
            const { inherit } = splitCanInheritStyle(style)
            parentsStyle.push(inherit)
          }
          parent = getCanInheritParent(parent)
        }
        if (parentsStyle.length) {
          const uniqueId = getUniqueIdStr(path)
          inheritStyle[uniqueId] = mergeParentsStyle(parentsStyle)
        }
      }
    },
    Program: {
      exit(path) {
        path.traverse({
          JSXElement(path) {
            // 对于非文本节点，移除可继承的样式属性
            if (!isTextNode(path)) {
              const uniqueId = getUniqueIdStr(path)
              const style = styleExceptInherit[uniqueId]
              if (style) {
                const { inherit } = splitCanInheritStyle(style)
                // TODO: 禁止直接修改this上的变量，改用方法修改
                Object.keys(inherit).forEach(key => delete style[key])
              }
            }
          }
        })
      }
    }
  })

  return inheritStyle
}

const getCanInheritParent = path => path.findParent(p => (
  p.isJSXElement() || 
  p.isProgram()
))

const splitCanInheritStyle = (style) => {
  const inherit = {}, noInHerit = {}
  Object.keys(style).forEach(key => {
    if (canInheritStyle.includes(key)) {
      inherit[key] = style[key]
    } else {
      noInHerit[key] = style[key]
    }
  })
  return { inherit, noInHerit }
}

const mergeParentsStyle = (parentsStyle) => {
  const style = {}
  parentsStyle.reverse().forEach(styles => {
    Object.entries(styles).forEach(([key, value]) => {
      style[key] = value
    })
  })
  return style
}
