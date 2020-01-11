const path = require('path')
const resolve = (p) => path.resolve(__dirname, p)

export default {
  input: resolve('../packages/core/app.js'),
  output: {
    name: 'r2rn',
    format: 'umd',
    file: resolve('../dist/r2rn.js')
  }
};

