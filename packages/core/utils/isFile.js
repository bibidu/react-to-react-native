module.exports = function isFile(filePath, currentResolves) {
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
      require('fs').statSync(entirePath)
      info = {
        entirePath,
        type,
        suffix,
      }
      break
    } catch (error) {}
  }

  if (!info) {
    console.error('isFile can not find path: ', filePath);
  }
  return info
}