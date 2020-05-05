module.exports = function visitorsCreator() {
  const visitors = [
    require('./addStyleAccordingToUniqueId'),
    require('./clean'),
  ]

  return visitors
}