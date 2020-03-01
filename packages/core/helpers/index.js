const hash = require('./hash')
const createGraph = require('./createGraph')
const uniqueId = require('./uniqueId')
const astToRelationTree = require('./astToRelationTree')
const convertTagReference = require('./convertTagReference')

module.exports = function () {
  ;[
    hash,
    createGraph,
    uniqueId,
    astToRelationTree,
    convertTagReference,
  ].forEach(helper => this[helper.name + 'Helper'] = helper)
}