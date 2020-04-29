const cssToObject = require('./cssToObject')
const convertStyleToRN = require('./convertStyleToRN')
const generatePureHtmlString = require('./generatePureHtmlString')
const generateReactNativeComponent = require('./generateReactNativeComponent')
const convertExternalToInline = require('./convertExternalToInline')
const removeInvalidStyle = require('./removeInvalidStyle')
const createGraph = require('./createGraph')
const convertTagReference = require('./convertTagReference')
const astToRelationTree = require('./astToRelationTree')
const calcStaticNodeInheritStyle = require('./calcStaticNodeInheritStyle')
const styleFixer = require('./styleFixer')
const logger = require('./logger')
const utils = require('./utils')
const astUtils = require('./astUtils')
const jsxUtils = require('./jsxUtils')

module.exports = function () {
  ;[
    logger,
    cssToObject,
    convertStyleToRN,
    generatePureHtmlString,
    astUtils,
    jsxUtils,
    generateReactNativeComponent,
    convertExternalToInline,
    removeInvalidStyle,
    createGraph,
    convertTagReference,
    astToRelationTree,
    utils,
    styleFixer,
    calcStaticNodeInheritStyle,
  ].forEach(util => {
    this[util.name] = bindContext(util, this)
  })
}

function isFunction(maybeFunction) {
  return typeof maybeFunction === 'function'
}

function bindContext(objOrFn, context) {
  if (isFunction(objOrFn)) {
    return objOrFn.bind(context)
  }

  const bindedContextObj = {}
  for (let key in objOrFn) {
    bindedContextObj[key] = isFunction(objOrFn[key]) ? objOrFn[key].bind(context) : objOrFn[key]
  }
  return bindedContextObj
}