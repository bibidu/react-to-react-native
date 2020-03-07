module.exports = function omit(obj, deleteKeys) {
  deleteKeys.forEach(key => key in obj && delete obj[key])
  return obj
}