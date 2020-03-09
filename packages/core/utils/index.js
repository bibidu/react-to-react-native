const log = require('./log')
const error = require('./error')
const cssToObject = require('./cssToObject')
const convertStyleToRN = require('./convertStyleToRN')
const generatePureHtmlString = require('./generatePureHtmlString')
const astUtils = require('./astUtils')
const jsxUtils = require('./jsxUtils')
const generateReactNativeComponent = require('./generateReactNativeComponent')
const mixinStyleExceptInherit = require('./mixinStyleExceptInherit')
const convertExternalToInline = require('./convertExternalToInline')
const calcInheritStyle = require('./calcInheritStyle')
const removeInvalidStyle = require('./removeInvalidStyle')
const mergeByKey = require('./mergeByKey')
const getInheritStyle = require('./getInheritStyle')
const omit = require('./omit')
const extract = require('./extract')
const isUserComponent = require('./isUserComponent')

module.exports = function () {
  ;[
    log,
    error,
    cssToObject,
    convertStyleToRN,
    generatePureHtmlString,
    astUtils,
    jsxUtils,
    generateReactNativeComponent,
    mixinStyleExceptInherit,
    convertExternalToInline,
    calcInheritStyle,
    removeInvalidStyle,
    mergeByKey,
    getInheritStyle,
    omit,
    extract,
    isUserComponent,
  ].forEach(util => this[util.name] = util)
}