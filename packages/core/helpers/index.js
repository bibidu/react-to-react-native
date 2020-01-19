const hash = require('./hash')
const createGraph = require('./createGraph')

module.exports = function () {
  ;[
    hash,
    createGraph,
  ].forEach(helper => this[helper.name + 'Helper'] = helper)
}