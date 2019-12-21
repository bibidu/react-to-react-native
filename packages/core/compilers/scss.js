module.exports = function scss(css) {
  return new Promise((resolve, reject) => {
    this.log('scssCompiler')
    resolve(css)
  })
}