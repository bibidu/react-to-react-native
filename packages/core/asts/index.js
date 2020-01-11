const processAST = require('./processAST')
const packageAST = require('./packageAST')

module.exports = function () {
  ;[
    processAST,
    packageAST,
  ].forEach(util => this[util.name] = util)
}