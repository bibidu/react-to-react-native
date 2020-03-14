const sass = require('node-sass')

module.exports = function scss(code, filePath) {
  return new Promise((resolve, reject) => {
    this.log('scssCompiler')
    sass.render({
      data: code,
      file: filePath || undefined
    }, (err, r) => {
      if (err) {
        return this.error(err)
      }
      const css = r.css.toString()
      resolve(css)
    })
  })
}