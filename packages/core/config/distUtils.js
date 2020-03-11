module.exports = function distUtils() {
  const {
    canInheritStyleName
  } = this.constants

const extract = (obj, extractKeys) => {
  const result = {}
  for (let key in obj) {
    if (extractKeys.includes(key)) {
      result[key] = obj[key]
    }
  }
  return result
}
const extractInheritStyleName = (obj) => {
  return extract(obj, canInheritStyleName)
}
const imgPolyfill = (src) => typeof src === 'number' ? src : { uri: src }
const eventTarget = (e) => ({
  target: {
    value: e
  }
})

  return `
// 文本节点可继承的css属性名
export const canInheritStyleName = ${JSON.stringify(canInheritStyleName, null, 2)}

// 与omit相反，只提取目标对象中的属性值
export const extract = ${extract}

// 提取目标对象中的 可继承style名
export const extractInheritStyleName = ${extractInheritStyleName}

// 兼容rn的图片source引用
export const imgPolyfill = ${imgPolyfill}

// 兼容rn的事件event.target
export const eventTarget = ${eventTarget}
`
}