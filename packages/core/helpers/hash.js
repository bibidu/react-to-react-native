const _hash = require('object-hash')

module.exports = function hash(str) {
  if (!str) {
    return 'NONE_'
  }
  return _hash(str).slice(-8)
}