module.exports = function extract(obj, extractKeys) {
  const result = {}
  extractKeys.forEach(key => key in obj && (result[key] = obj[key]))
  return result
}