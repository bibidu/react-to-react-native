const transform = require('css-to-react-native').default

const shouldDeleteAttrNames = [
  'textShadow',
  'boxSizing',
  'display',
]

function deleteUnSupportAttr(obj) {
  const attrNames = Object.keys(obj)
  attrNames.forEach(attrName => {
    if (shouldDeleteAttrNames.includes(attrName)) {
      delete obj[attrName]
    }
  })
}

module.exports = function transformAllStyle(mixinedAllStyle) {
  Object.entries(mixinedAllStyle).forEach(([ uniqueId, style]) => {
    mixinedAllStyle[uniqueId] = _transform(style)
  })
  removeEmpty(mixinedAllStyle)
  return mixinedAllStyle
}

function _transform(obj) {
  deleteUnSupportAttr(obj)
  const arrayStyle = objStyleToTransformArray(obj)
  try {
    const result = transform(arrayStyle)
    return result
  } catch (error) {
    throw '[ERROR] cssToReactNative error'
    return {}
  }
}

const objStyleToTransformArray = (obj) => {
  const array = []
  for (let key of Object.keys(obj)) {
    const value = obj[key]
    array.push([key, value])
  }
  return array
}

function removeEmpty(styles) {
  Object.entries(styles).forEach(([key, value]) => {
    if (!Object.keys(value).length) {
      delete styles[key]
    }
  })
}