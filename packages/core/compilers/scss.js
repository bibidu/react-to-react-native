const sass = require('node-sass')

module.exports = function scss(code, filePath) {
  return new Promise((resolve, reject) => {
    this.log('scssCompiler')
    console.log(code);
    if (!code.trim()) {
      return resolve('')
    }
    sass.render({
      data: code,
      file: filePath || undefined
    }, (err, r) => {
      if (err) {
        this.errors.add(err && err.message)
        this.error(err)
        resolve('')
      } else {
        const css = r.css.toString()
        resolve(css)
      }
    })
  })
}