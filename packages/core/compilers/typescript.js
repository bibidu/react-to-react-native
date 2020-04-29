const ts = require('typescript')

const compilerOptions = {
  target: "ES6",
  esModuleInterop: true,
  module: ts.ModuleKind.ES6,
  jsx: 'preserve',
}
module.exports = function typescript(code) {
  return new Promise((resolve, reject) => {
  this.logger.log({ type: 'flow', msg: 'typescript compile' })

    const output = ts.transpileModule(code, { compilerOptions })
    resolve(output.outputText)
  })
}