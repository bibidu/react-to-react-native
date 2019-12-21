const processAST = require('./processAST')
const package = require('./package')

module.exports = function () {
  ;[
    processAST,
    package,
  ].forEach(util => this[util.name] = util)
}