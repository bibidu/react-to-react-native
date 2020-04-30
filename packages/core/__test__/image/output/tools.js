
// 文本节点可继承的css属性名
export const canInheritStyleName = [
  "line-height",
  "color",
  "font-size",
  "text-align",
  "font-weight",
  "lineHeight",
  "color",
  "fontSize",
  "textAlign",
  "fontWeight"
]

// 去除目标对象中的属性值
export const _omit = function() {
  const objs = Array.from(arguments)
  const deleteKeys = objs.pop()
  const result = {}
  objs.forEach(obj => {
    for (let key in obj) {
      if (!deleteKeys.includes(key)) {
        result[key] = obj[key]
      }
    }
  })
  return result
}

// 与omit相反，只提取目标对象中的属性值
export const _extract = function() {
  const objs = Array.from(arguments)
  const extractKeys = objs.pop()
  const result = {}
  objs.forEach(obj => {
    for (let key in obj) {
      if (extractKeys.includes(key)) {
        result[key] = obj[key]
      }
    }
  })
  return result
}

// 去除目标对象中的 可继承style名
export const omit = (...objs) => {
  return _omit(...objs, canInheritStyleName)
}

// 提取目标对象中的 可继承style名
export const extend = (...objs) => {
  return _extract(...objs, canInheritStyleName)
}

// 兼容rn的图片source引用
export const imgPolyfill = (src) => typeof src === 'number' ? src : { uri: src }

// 兼容rn的事件event.target
export const eventPolyfill = (e) => ({
  target: {
    value: e
  }
})
