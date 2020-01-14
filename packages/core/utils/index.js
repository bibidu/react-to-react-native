const log = require('./log')
const error = require('./error')
const cssToObject = require('./cssToObject')
const astToRelationTree = require('./astToRelationTree')
const transformAllStyle = require('./transformAllStyle')
const relationTreeToHtml = require('./relationTreeToHtml')
const generatePureHtmlString = require('./generatePureHtmlString')
const astUtils = require('./astUtils')
const jsxUtils = require('./jsxUtils')
const generateReactNativeComponent = require('./generateReactNativeComponent')
const mixinStyleExceptInherit = require('./mixinStyleExceptInherit')
const convertExternalToInline = require('./convertExternalToInline')
const calcInheritStyle = require('./calcInheritStyle')
const mixinInheritAndOther = require('./mixinInheritAndOther')

module.exports = function () {
  ;[
    log,
    error,
    cssToObject,
    astToRelationTree,
    transformAllStyle,
    generatePureHtmlString,
    astUtils,
    jsxUtils,
    generateReactNativeComponent,
    mixinStyleExceptInherit,
    convertExternalToInline,
    calcInheritStyle,
    mixinInheritAndOther,
  ].forEach(util => this[util.name] = util)
}