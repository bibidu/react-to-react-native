module.exports = function({path, ctx, t, constant}) {
  path.get('openingElement.name').replaceWith(t.JSXIdentifier('scrollview'))
}