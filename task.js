const fs = require('fs')
const path = require('path')

// 写入example到web-server中
writeExample()

function writeExample() {
  const exampleDir = path.join(__dirname, 'packages/core/__test__')
  let str = 'const examples = ['
  fs.readdir(exampleDir,  (err, files) => {
    if (err) return
    files.forEach(file => {
      if (!file.startsWith('.')) {
        let filepath = path.join(__dirname, 'packages/core/__test__', file, 'input', 'index.js')
        !isFile(filepath) && (filepath = filepath.replace(/\.js$/, '.ts'))
        if (isFile(filepath)) {
          const cssFilepath = filepath.replace(/index\.(\w+)$/, 'app.scss')
          const inputJs = fs.readFileSync(filepath, 'utf8')
          const inputCss = isFile(cssFilepath) ? fs.readFileSync(cssFilepath, 'utf8') : ''
          str += `\n{
            title: \`${file}\`,
            inputJs: \`${inputJs.replace(/\`/mg, "\\`").replace(/\${/mg, '\\${')}\`,
            inputCss: \`${inputCss.replace(/\`/mg, "\\`")}\`,
          },\n`
        }
      }
    })
    str += ']'
    fs.writeFileSync(path.join(__dirname, 'packages/web-server/static/js/example.js'), str, 'utf8')
})
}

function isFile(filepath) {
  try {
    fs.statSync(filepath)
    return true
  } catch (error) {
    return false
  }
}