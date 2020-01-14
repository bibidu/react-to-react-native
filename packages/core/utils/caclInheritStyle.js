const t = require('@babel/types')
const traverse = require('@babel/traverse').default
const gen = require('@babel/generator').default

const textNames = [
  'Text',
]

const caclInheritStyle = [
  'line-height',
  'color',
  'font-size',
]

module.exports = function caclInheritStyle({
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
            parentsStyle.push(extractCanInheritStyle(style))
          }
          parent = getCanInheritParent(parent)
        }
        if (parentsStyle.length) {
          const uniqueId = getUniqueIdStr(path)
          inheritStyle[uniqueId] = mergeParentsStyle(parentsStyle)
        }
      }
    }
  })

  return inheritStyle
}

const getCanInheritParent = path => path.findParent(p => (
  p.isJSXElement() || 
  p.isProgram()
))

const extractCanInheritStyle = (style) => {
  const newStyle = {}
  Object.keys(style).forEach(key => {
    if (caclInheritStyle.includes(key)) {
      newStyle[key] = style[key]
    }
  })
  return newStyle
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
