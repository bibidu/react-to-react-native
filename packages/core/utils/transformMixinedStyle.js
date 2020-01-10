const transform = require('css-to-react-native').default

const shouldDeleteAttrNames = [
  'text-shadow'
]

function deleteUnSupportAttr(obj) {
  const attrNames = Object.keys(obj)
  attrNames.forEach(attrName => {
    if (shouldDeleteAttrNames.includes(attrName)) {
      delete obj[attrName]
    }
  })
}

module.exports = function transformMixinedStyle(mixinedAllStyle) {
  Object.entries(mixinedAllStyle).forEach(([ uniqueId, style]) => {
    mixinedAllStyle[uniqueId] = _transform(style)
  })
  return mixinedAllStyle
}

function _transform(obj) {
  deleteUnSupportAttr(obj)
  const arrayStyle = objStyleToTransformArray(obj)
  try {
    const result = transform(arrayStyle)
    return result
  } catch (error) {
    return '[ERROR] cssToReactNative error'
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
