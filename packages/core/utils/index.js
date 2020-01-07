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
const astUtils = require('./astUtils')
const jsxUtils = require('./jsxUtils')

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
    astUtils,
    jsxUtils,
  ].forEach(util => this[util.name] = util)
}