const fs = require('fs')
const _hash = require('object-hash')

exports.name = 'utils'

exports.omit = function(source, deleteKeys) {
  const omited = {}
  for (let key in source) {
    if (!deleteKeys.includes(key)) {
      omited[key] = source[key]
    }
  }
  return omited
}

exports.extract = function(source, extractKeys) {
  const extracted = {}
  for (let key in source) {
    if (extractKeys.includes(key)) {
      extracted[key] = source[key]
    }
  }
  return extracted
}

let id = 0
exports.generateId = function(prefix) {
  return `$${prefix}` + (++id)
}

exports.merge = function(...objs) {
  const mixins = {}
  for (let obj of objs) {
    for (let item of Object.keys(obj)) {
      if (!mixins[item]) {
        mixins[item] = obj[item]
      } else {
        mixins[item] = Object.assign({}, mixins[item], obj[item])
      }
    }
  }
  return mixins
}

exports.isFile = function(filePath, currentResolves) {
  let resolves = this.constants.resolves || currentResolves
  // 已含有后缀
  if (/\.\w+$/.test(filePath)) {
    const lastPointIndex = filePath.lastIndexOf('.')
    const suffix = filePath.slice(lastPointIndex)
    resolves = {
      [suffix]: resolves[suffix]
    }
    filePath = filePath.slice(0, lastPointIndex)
  }
  // 非resolves内类型暂不考虑
  let info = null
  for (let suffix of Object.keys(resolves)) {
    try {
      const type = resolves[suffix]
      const entirePath = filePath + suffix
      fs.statSync(entirePath)
      info = {
        entirePath,
        type,
        suffix,
      }
      break
    } catch (error) {}
  }

  if (!info) {
    this.logger.error('isFile can not find path: ', filePath);
  }
  return info
}

exports.mixinStyle = function ({
  external,
  inline,
  self,
  cssObject,
}) {
  const mixins = this.utils.merge(self, external, inline)
  
  const stableStyle = extractStableStyle(cssObject)

  return Object.assign({}, mixins, stableStyle)

  function extractStableStyle({ externalStyle, stableClassNames }) {
    const stableStyle = {}
    Object.entries(stableClassNames).forEach(([k, selector]) => {
      stableStyle[selector] = externalStyle[k]
    })
  
    return stableStyle
  }
}

exports.isUserComponent = function(tagName) {
  return (
    tagName.charAt(0) !== tagName.charAt(0).toLowerCase() &&
    tagName !== 'Fragment' &&
    tagName !== 'React.Fragment'
  )
}

exports.hash = function(str) {
  if (!str) {
    return 'NONE_'
  }
  return _hash(str).slice(-8)
}

const tagCount = {}
exports.uniqueId = function(path) {
  const tagName = this.jsxUtils.getTagName(path)
  const prefix = this.enums.UNIQUE_ID + tagName.charAt(0).toUpperCase() + tagName.slice(1)
  if (!tagCount[prefix]) {
    tagCount[prefix] = 0
  }
  return prefix + (tagCount[prefix]++ === 0 ? '' : tagCount[prefix])

}

const logs = {}
exports.logStart = (k) => {
  logs[k] = new Date().getTime()
}
exports.logEnd = (k, options = {}) => {
  const now = new Date().getTime()
  let allTime = logs[k] ? now - logs[k] : 0
  delete logs[k]

  const unit = options.unit || 's'
  if (unit === 's') {
    allTime = allTime * 0.001
    return String(allTime).replace(/(.+\.\w\w\w)\w*/, '$1')
  }
}