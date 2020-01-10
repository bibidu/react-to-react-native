 const visitors = [
  require('./addTextWrapper'),
  require('./addUniqueId'),
  require('./collectInfo'),
  require('./astToRelationTree'),
  require('./convertReactTagToRN'),
  require('./addStyleAccordingToUniqueId'),
]

if (!process.env.COMPILE_ENV || process.env.COMPILE_ENV === 'node') {
  visitors.unshift(require('./resolveCssPath'))
}

module.exports = visitors