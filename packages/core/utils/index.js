const log = require('./log')
const error = require('./error')
const cssToObject = require('./cssToObject')
const transformAllStyle = require('./transformAllStyle')
const generatePureHtmlString = require('./generatePureHtmlString')
const astUtils = require('./astUtils')
const jsxUtils = require('./jsxUtils')
const generateReactNativeComponent = require('./generateReactNativeComponent')
const mixinStyleExceptInherit = require('./mixinStyleExceptInherit')
const convertExternalToInline = require('./convertExternalToInline')
const calcInheritStyle = require('./calcInheritStyle')
const mixinInheritAndOther = require('./mixinInheritAndOther')
const mergeByKey = require('./mergeByKey')
const getInheritStyle = require('./getInheritStyle')
const omit = require('./omit')
const isUserComponent = require('./isUserComponent')

module.exports = function () {
  ;[
    log,
    error,
    cssToObject,
    transformAllStyle,
    generatePureHtmlString,
    astUtils,
    jsxUtils,
    generateReactNativeComponent,
    mixinStyleExceptInherit,
    convertExternalToInline,
    calcInheritStyle,
    mixinInheritAndOther,
    mergeByKey,
    getInheritStyle,
    omit,
    isUserComponent,
  ].forEach(util => this[util.name] = util)
}