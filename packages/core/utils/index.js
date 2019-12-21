const log = require('./log')
const error = require('./error')
const cssToObject = require('./cssToObject')
const astToRelationTree = require('./astToRelationTree')
const cssToReactNative = require('./cssToReactNative')
const externalStyleToInlineStyle = require('./externalStyleToInlineStyle')
const findASTNode = require('./findASTNode')
const relationTreeToHtml = require('./relationTreeToHtml')

module.exports = function () {
  ;[
    log,
    error,
    cssToObject,
    astToRelationTree,
    cssToReactNative,
    cssToReactNative,
    externalStyleToInlineStyle,
    findASTNode,
  ].forEach(util => this[util.name] = util)
}