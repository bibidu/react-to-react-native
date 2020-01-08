const fs = require('fs')
const path = require('path')
const isCSSPath = (value) => /(css|scss)(\;*)$/.test(value)

module.exports = function resolveCssPath({ ctx, t }) {
  return {
    ImportDeclaration(p) {
      if (p.get('source').isStringLiteral()) {
        const maybeCssPath = p.get('source').node.value
        if (isCSSPath(maybeCssPath)) {
          const cssAbsolutePath = path.resolve(path.dirname(ctx.reactCompPath), maybeCssPath)
          const cssString = fs.readFileSync(cssAbsolutePath, 'utf8')
          ctx.addCssString(cssAbsolutePath, cssString)
          p.remove()
        }
      }
    }
  }
}