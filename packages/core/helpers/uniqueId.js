let id = 0

module.exports = function uniqueId() {
  return this.enums.UNIQUE_ID + (++id)
}