module.exports = function omit(obj, deleteKeys) {
  const result = {}
  deleteKeys.forEach(key => !(key in obj) && (result[key] = obj[key]))
  return result
}