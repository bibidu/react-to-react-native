
// 文本节点可继承的css属性名
export const canInheritStyleName = [
  "line-height",
  "color",
  "font-size",
  "text-align",
  "lineHeight",
  "color",
  "fontSize",
  "textAlign"
]

// 与omit相反，只提取目标对象中的属性值
export const extract = (obj, extractKeys) => {
  const result = {}
  for (let key in obj) {
    if (extractKeys.includes(key)) {
      result[key] = obj[key]
    }
  }
  return result
}

// 提取目标对象中的 可继承style名
export const extractInheritStyleName = (obj) => {
  return extract(obj, canInheritStyleName)
}
