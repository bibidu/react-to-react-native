module.exports = function typescript(code) {
  return new Promise((resolve, reject) => {
    this.log('typescriptCompiler')
    resolve(code)
  })
}