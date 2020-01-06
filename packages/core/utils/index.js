const log = require('./log')
const error = require('./error')
const cssToObject = require('./cssToObject')
const astToRelationTree = require('./astToRelationTree')
const cssToReactNative = require('./cssToReactNative')
const externalStyleToInlineStyle = require('./externalStyleToInlineStyle')
const findASTNode = require('./findASTNode')
const relationTreeToHtml = require('./relationTreeToHtml')
const generateAST = require('./generateAST')
const generatePureHtmlString = require('./generatePureHtmlString')
const getUniqueIdPrefix = require('./getUniqueIdPrefix')
const generateInjectBrowserScript = require('./generateInjectBrowserScript')
const runInBrowser = require('./runInBrowser')
const ast2code = require('./ast2code')
const getJSXAttribute = require('./getJSXAttribute')

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
    generateAST,
    generatePureHtmlString,
    getUniqueIdPrefix,
    generateInjectBrowserScript,
    runInBrowser,
    ast2code,
    getJSXAttribute,
  ].forEach(util => this[util.name] = util)
}