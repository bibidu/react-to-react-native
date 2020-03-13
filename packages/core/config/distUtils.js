module.exports = function distUtils() {
  const {
    canInheritStyleName
  } = this.constants
  const {
    OMIT_CAN_INHERIT_STYLE_NAME_FUNC,
    EXTRACT_CAN_INHERIT_STYLE_NAME_FUNC,
    IMG_POLYFILL_FUNC,
    EVENT_TARGET_FUNC,
  } = this.enums

const _omit = function() {
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
const _extract = function() {
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
const extractInheritStyleName = (...objs) => {
  return _extract(...objs, canInheritStyleName)
}
const omitInheritStyleName = (...objs) => {
  return _omit(...objs, canInheritStyleName)
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

// 去除目标对象中的属性值
export const _omit = ${_omit}

// 与omit相反，只提取目标对象中的属性值
export const _extract = ${_extract}

// 去除目标对象中的 可继承style名
export const ${OMIT_CAN_INHERIT_STYLE_NAME_FUNC} = ${omitInheritStyleName}

// 提取目标对象中的 可继承style名
export const ${EXTRACT_CAN_INHERIT_STYLE_NAME_FUNC} = ${extractInheritStyleName}

// 兼容rn的图片source引用
export const ${IMG_POLYFILL_FUNC} = ${imgPolyfill}

// 兼容rn的事件event.target
export const ${EVENT_TARGET_FUNC} = ${eventTarget}
`
}