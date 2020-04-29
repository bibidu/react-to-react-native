const sass = require('node-sass')

module.exports = function scss(code, filePath) {
  return new Promise((resolve) => {
  this.logger.log({ type: 'flow', msg: 'scss compile' })

    if (!code.trim()) {
      return resolve('')
    }
    sass.render({
      data: code,
      file: filePath || undefined
    }, (err, r) => {
      if (err) {
        this.errors.add(err && err.message)
        thislogger.error(err)
        resolve('')
      } else {
        const css = r.css.toString()
        resolve(css)
      }
    })
  })
}