const textNames = [
  'span',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
]

const resolves = {
  '.jsx': 'react',
  '.js': 'react',
  '.ts': 'react',
  '.tsx': 'react',
  '.css': 'css',
  '.scss': 'css',
  '.sass': 'css',
  '.png': 'img',
  '.jpeg': 'img',
  '.jpg': 'img',
  '/index.js': 'react'
}

const baseInheritStyleName = [
  'line-height',
  'color',
  'font-size',
  'text-align',
  'font-weight',
]

function expandDiffTypeInHeritStyle(base) {
  return base.concat(base.map(name => (
    name.replace(/(\w+)\-(\w)(\w+)/, (_, a, b, c) => `${a}${b.toUpperCase()}${c}`)
  )))
}

module.exports = {
  // 文本节点
  textNames,
  // 解析文件的顺序
  resolves,
  // 可继承的css属性名
  canInheritStyleName: expandDiffTypeInHeritStyle(baseInheritStyleName)
}