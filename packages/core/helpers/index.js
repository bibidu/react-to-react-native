
module.exports = function () {
  ;[
  ].forEach(helper => this[helper.name + 'Helper'] = helper)
}