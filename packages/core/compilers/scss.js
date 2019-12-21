const sass = require('sass')

module.exports = function scss(code) {
  return new Promise((resolve, reject) => {
    this.log('scssCompiler')
    sass.render({ data: code }, (err, r) => {
      if (err) {
        return this.error(err)
      }
      const css = r.css.toString()
      resolve(css)
    })
  })
}