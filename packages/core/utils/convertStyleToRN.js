const transform = require('css-to-react-native').default
let ctx = null

const shouldPreprocessAttr = [
  {
    match: (attrName, attrValue) => /^border\-(top|left|right|bottom)/.test(attrName),
    warnings: [],
    actions: (obj, attrName, attrValue) => {
      const direction = attrName.split('border-')[1]
      const firstCharUpper = direction.charAt(0).toUpperCase() + direction.slice(1)
      const [borderWidth, borderStyle, borderColor] = attrValue.split(' ').filter(Boolean)
      if (borderWidth !== 'none') {
        obj[`border${firstCharUpper}Width`] = borderWidth
        obj['borderStyle'] = borderStyle
        obj['borderColor'] = borderColor
      }
    }
  },
  {
    match: (attrName, attrValue) => attrName === 'text-shadow',
    warnings: [],
    actions: (obj) => delete obj['textShadow']
  },
  {
    match: (attrName, attrValue) => attrName === 'box-sizing',
    warnings: [],
    actions: (obj) => delete obj['boxSizing']
  },
  {
    match: (attrName, attrValue) => attrName === 'display',
    warnings: [],
    actions: (obj) => delete obj['display']
  },
  {
    match: (attrName, attrValue) => attrName === 'outline',
    warnings: [],
    actions: (obj) => delete obj['outline']
  },
  {
    match: (attrName, attrValue) => attrName === 'position' && attrValue === 'fixed',
    warnings: [
      'rn 不支持position: fixed属性，请将超出屏幕的部分使用ScrollView包裹',
      'rn中绝对定位的所有父级必须均为绝对定位，可通过添加父级style为position: absolute;top:0;left:0;width:100%;height:100%;'
    ],
    actions: (obj) => obj['position'] = 'absolute'
  },
  {
    match: (attrName, attrValue) => attrName === 'position' && attrValue === 'absolute',
    warnings: [
      'rn中绝对定位的所有父级必须均为绝对定位，可通过添加父级style为position: absolute;top:0;left:0;width:100%;height:100%;'
    ],
    actions: (obj) => {}
  },
  {
    match: (attrName, attrValue) => attrName.includes('transform') && attrValue.startsWith('translate('),
    warnings: [],
    actions: (obj, attrName, attrValue) => {
      delete obj[attrName]
    }
  }
]

function checkUnSupportAttr(obj) {
  Object.entries(obj).forEach(([attrName, attrValue]) => {
    shouldPreprocessAttr.forEach((item) => {
      const { match, warnings, actions} = item
      if (match(attrName, attrValue)) {
        warnings.forEach(item => ctx.warnings.add(item))
        actions(obj, attrName, attrValue)
      }
    })
  })
}

module.exports = function convertStyleToRN(styles) {
  ctx = this

  Object.entries(styles).forEach(([uniqueId, style]) => {
    const result = _transformMain(style)
    styles[uniqueId] = result
  })

  removeEmpty(styles)
  return styles
}

function _transformMain(obj) {
  let result = {}
  checkUnSupportAttr(obj)
  const arrayStyle = objStyleToTransformArray(obj)
  try {
    result = _transform(arrayStyle)
  } catch (error) {
    console.error('[ERROR] cssToReactNative error' + error) 
    return result
  }

  return result
}

function _transform(arrayStyle) {
  const caches = {}
  const deleteIdx = []
  
  arrayStyle = arrayStyle.filter((_, idx) => !deleteIdx.includes(idx))
  const result = transform(arrayStyle)
  Object.entries(caches).forEach(([k, v]) => {
    result[k] = v
  })

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