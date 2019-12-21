
const parser = require('@babel/parser')

module.exports = function generateAST(code) {
  const ast = parser.parse(code, {
    sourceType: "module",
    plugins: [
      "jsx",
    ]
  })
  return ast
}