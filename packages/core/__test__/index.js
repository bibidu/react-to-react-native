const { join } = require('path')
const convertIns = require('../app')

const path = (p) => join(__dirname, p || '.')

new convertIns().init({
  entryPath: path('inherit-style/input/index.js'),
  exportPath: path('inherit-style/output/index.js'),
}).start()