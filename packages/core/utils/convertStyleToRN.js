const transform = require('css-to-react-native').default

const shouldDeleteAttrNames = [
  'textShadow',
  'boxSizing',
  'display',
]

let replaceKey = null
let storeValue = null

function storeKey(obj) {
  if (replaceKey && replaceKey in obj) {
    storeValue = obj[replaceKey]
    delete obj[replaceKey]
  }
}

function restoreKey(obj) {
  if (replaceKey && storeValue) {
    obj[replaceKey] = storeValue
    storeValue = null
  }
}

function deleteUnSupportAttr(obj) {
  const attrNames = Object.keys(obj)
  attrNames.forEach(attrName => {
    if (shouldDeleteAttrNames.includes(attrName)) {
      delete obj[attrName]
    }
  })
}

module.exports = function convertStyleToRN(styles) {
  const ctx = this

  function isStableClass(uniqueId) {
    return !uniqueId.startsWith(ctx.enums.UNIQUE_ID)
  }

  replaceKey = ctx.enums.ACTIVE_CLASSNAME_WILL_REPLACEBY_STYLESHEET

  Object.entries(styles).forEach(([uniqueId, style]) => {
    !isStableClass(uniqueId) && storeKey(style)

    const result = _transform(style)
    
    !isStableClass(uniqueId) && restoreKey(result)

    styles[uniqueId] = result
  })

  removeEmpty(styles)
  return styles
}

function _transform(obj) {
  let result = {}
  deleteUnSupportAttr(obj)

  const arrayStyle = objStyleToTransformArray(obj)
  try {
    result = transform(arrayStyle)
  } catch (error) {
    throw '[ERROR] cssToReactNative error'
    return result
  }

  return result
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