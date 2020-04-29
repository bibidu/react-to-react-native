const transform = require('css-to-react-native').default
let ctx = null

const shouldPreprocessAttr = [
  {
    match: (attrName, attrValue) => {
      return [
        'border',
        'border-top',
        'border-bottom',
        'border-left',
        'border-right',
      ].includes(attrName) && attrValue.split(' ').length === 2
    },
    warnings: [],
    actions: (obj, attrName, attrValue) => {
      const [borderLength, borderStyle, _borderColor] = attrValue.split(' ')
      if (!_borderColor) {
        const borderColor = obj[`${attrName}Color`] || obj.borderColor || '#111'
        obj[attrName] = `${obj[attrName]} ${borderColor}`
      }
    }
  },
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
      delete obj[attrName]
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
    match: (_, $, obj) => {
      const hasDisplay = Object.keys(obj).includes('display')
      const displayIsFlex = obj['display'] === 'flex'
      const hasFlexDirection = Boolean(obj['flexDirection'])
      return hasDisplay && displayIsFlex && !hasFlexDirection
    },
    warnings: [],
    actions: (obj, attrName, attrValue) => {
      obj['flexDirection'] = 'row'
    }
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
      'rn中绝对定位的所有父级必须均为绝对定位，可通过添加父级style为position: absolute;top:0;left:0;width:100%;height:100%;',
      '添加的绝对定位父级位置错误时，可通过设置justifyContent、alignItems、flexDirection解决'
    ],
    actions: (obj) => obj['position'] = 'absolute'
  },
  {
    match: (attrName, attrValue) => attrName === 'position' && attrValue === 'absolute',
    warnings: [
      'rn中绝对定位的所有父级必须均为绝对定位，可通过添加父级style为position: absolute;top:0;left:0;width:100%;height:100%;',
      '添加的绝对定位父级位置错误时，可通过设置justifyContent、alignItems、flexDirection解决'
    ],
    actions: (obj) => {}
  },
  {
    match: (attrName, attrValue) => attrName.includes('transform') && attrValue.startsWith('translate('),
    warnings: [],
    actions: (obj, attrName, attrValue) => {
      delete obj[attrName]
    }
  },
  {
    match: (attrName, attrValue) => attrName === 'background' && /\s*:*url\(/.test(attrValue),
    warnings: [],
    actions: (obj, attrName, attrValue) => {
      const attrs = {}
      const backgroundValues = attrValue.split(' ')
      backgroundValues.forEach(value => {
        // 暂只支持url
        const matches = value.match(/url\(['"]([\w\W]+)['"]\)/)
        if (matches && matches.length > 1) {
          attrs[ctx.enums.MIDWAY_BGURL] = matches[1]
        }
      })
      delete obj[attrName]
      Object.assign(obj, attrs)
    }
  },
  {
    match: (_, $, obj) => {
      const isAbsolute = obj['position'] === 'absolute'
      const widthIs100Percent = obj['width'] === '100%'
      const dontHaveLeftOrRight = !obj['left'] || !obj['right']
      const heightIs100Percent = obj['width'] === '100%'
      const dontHaveTopOrBottom = !obj['top'] || !obj['bottom']

      const needPerfectWidth = widthIs100Percent && dontHaveLeftOrRight
      const needPerfectHeight = heightIs100Percent && dontHaveTopOrBottom
      return isAbsolute && (needPerfectWidth || needPerfectHeight)
    },
    warnings: [],
    actions: (obj, attrName, attrValue) => {
      const widthIs100Percent = obj['width'] === '100%'
      const heightIs100Percent = obj['width'] === '100%'

      if (widthIs100Percent) {
        if (!obj['left']) obj['left'] = '0'
        if (!obj['right']) obj['right'] = '0'
        delete obj['width']
      }
      if (heightIs100Percent) {
        if (!obj['top']) obj['top'] = '0'
        if (!obj['bottom']) obj['bottom'] = '0'
        delete obj['height']
      }
    }
  },
]

function checkUnSupportAttr(obj) {
  Object.entries(obj).forEach(([attrName]) => {
    shouldPreprocessAttr.forEach((item) => {
      const { match, warnings, actions} = item
      // 使用obj[attrName]的原因：
      //  在match的过程中会对attrValue的做出修改，但attrValue始终是初次的值
      const attrValue = obj[attrName]
      if (match(attrName, attrValue, obj)) {
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
    console.log(error)
    ctx.logger.error('cssToReactNative error' + error) 
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