const log = require('./log')
const error = require('./error')
const cssToObject = require('./cssToObject')
const astToRelationTree = require('./astToRelationTree')
const transformMixinedStyle = require('./transformMixinedStyle')
const relationTreeToHtml = require('./relationTreeToHtml')
const generatePureHtmlString = require('./generatePureHtmlString')
const generateInjectBrowserScript = require('./generateInjectBrowserScript')
const runInBrowser = require('./runInBrowser')
const astUtils = require('./astUtils')
const jsxUtils = require('./jsxUtils')
const generateReactNativeComponent = require('./generateReactNativeComponent')
const mixinAllStyle = require('./mixinAllStyle')

module.exports = function () {
  ;[
    log,
    error,
    cssToObject,
    astToRelationTree,
    transformMixinedStyle,
    generatePureHtmlString,
    generateInjectBrowserScript,
    runInBrowser,
    astUtils,
    jsxUtils,
    generateReactNativeComponent,
    mixinAllStyle,
  ].forEach(util => this[util.name] = util)
}