const baseInheritStyleName = [
  'line-height',
  'color',
  'font-size',
  'text-align',
]

function expandDiffTypeInHeritStyle(base) {
  return base.concat(base.map(name => (
    name.replace(/(\w+)\-(\w)(\w+)/, (_, a, b, c) => `${a}${b.toUpperCase()}${c}`)
  )))
}

module.exports = {
  // 文本节点
  textNames: [
    'span',
  ],
  // 可继承的css属性名
  canInheritStyleName: expandDiffTypeInHeritStyle(baseInheritStyleName)
}