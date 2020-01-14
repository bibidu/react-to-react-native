module.exports = function({path, ctx, t, constant}) {
  ctx.jsxUtils.replaceJSXAttributeKey(path, 'src', 'source')
}