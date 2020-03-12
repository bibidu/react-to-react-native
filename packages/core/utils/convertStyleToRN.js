const transform = require('css-to-react-native').default
let ctx = null
const shouldDeleteAttrNames = [
  'textShadow',
  'boxSizing',
  'display',
  'fixed',
  'outline',
]

const shouldWarnAttrValues = [
  {
    pairs: 'position-fixed',
    warnings: [
      'rn 不支持position: fixed属性，请将超出屏幕的部分使用ScrollView包裹',
      'rn中绝对定位的所有父级必须均为绝对定位，可通过添加父级style为position: absolute;top:0;left:0;width:100%;height:100%;'
    ],
    actions: (obj) => obj['position'] = 'absolute'
  },
  {
    pairs: 'position-absolute',
    warnings: [
      'rn中绝对定位的所有父级必须均为绝对定位，可通过添加父级style为position: absolute;top:0;left:0;width:100%;height:100%;'
    ],
    actions: (obj) => {}
  }
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
  Object.entries(obj).forEach(([attrName, attrValue]) => {
    if (shouldDeleteAttrNames.includes(attrName)) {
      delete obj[attrName]
    }
    shouldWarnAttrValues.forEach((item) => {
      const { pairs, warnings, actions} = item
      if (pairs === `${attrName}-${attrValue}`) {
        warnings.forEach(item => ctx.warnings.add(item))
        actions(obj)
      }
    })
  })
}

module.exports = function convertStyleToRN(styles) {
  ctx = this

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