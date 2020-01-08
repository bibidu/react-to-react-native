const log = require('./log')
const error = require('./error')
const cssToObject = require('./cssToObject')
const astToRelationTree = require('./astToRelationTree')
const cssToReactNative = require('./cssToReactNative')
const relationTreeToHtml = require('./relationTreeToHtml')
const generatePureHtmlString = require('./generatePureHtmlString')
const generateInjectBrowserScript = require('./generateInjectBrowserScript')
const runInBrowser = require('./runInBrowser')
const astUtils = require('./astUtils')
const jsxUtils = require('./jsxUtils')
const generateReactNativeComponent = require('./generateReactNativeComponent')

module.exports = function () {
  ;[
    log,
    error,
    cssToObject,
    astToRelationTree,
    cssToReactNative,
    cssToReactNative,
    generatePureHtmlString,
    generateInjectBrowserScript,
    runInBrowser,
    astUtils,
    jsxUtils,
    generateReactNativeComponent,
  ].forEach(util => this[util.name] = util)
}