const typescript = require('./typescript')
const scss = require('./scss')

module.exports = function () {
  ;[
    typescript,
    scss,
  ].forEach(util => this[util.name + 'Compiler'] = util)
}