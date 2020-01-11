const log = require('./log')
const error = require('./error')
const cssToObject = require('./cssToObject')
const astToRelationTree = require('./astToRelationTree')
const transformMixinedStyle = require('./transformMixinedStyle')
const relationTreeToHtml = require('./relationTreeToHtml')
const generatePureHtmlString = require('./generatePureHtmlString')
const astUtils = require('./astUtils')
const jsxUtils = require('./jsxUtils')
const generateReactNativeComponent = require('./generateReactNativeComponent')
const mixinAllStyle = require('./mixinAllStyle')
const convertExternalToInline = require('./convertExternalToInline')

module.exports = function () {
  ;[
    log,
    error,
    cssToObject,
    astToRelationTree,
    transformMixinedStyle,
    generatePureHtmlString,
    astUtils,
    jsxUtils,
    generateReactNativeComponent,
    mixinAllStyle,
    convertExternalToInline,
  ].forEach(util => this[util.name] = util)
}