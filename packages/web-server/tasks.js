const fs = require('fs')
const path = require('path')
const publicIp = require('public-ip')
const { execSync } = require('child_process')

const ENTRYS = [
  './static/index.html',
  './static/js/index.js',
]

function writeExample() {
  const exampleDir = path.join(__dirname, '../core/__test__')
  let str = 'const examples = ['
  fs.readdir(exampleDir,  (err, files) => {
    if (err) return
    files.forEach(file => {
      if (!file.startsWith('.')) {
        let filepath = path.join(__dirname, '../core/__test__', file, 'input', 'index.js')
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
    fs.writeFileSync(path.join(__dirname, './static/js/example.js'), str, 'utf8')
})
}

publicIp.v4().then(ip => {
  console.log(`ip ${ip}`)
  return ENTRYS.forEach(ENTRY => {
    const content = fs.readFileSync(ENTRY, 'utf8')
    fs.writeFileSync(ENTRY, content.replace(/localhost/g, ip), 'utf8')
  })
}).then(() => {
  console.log(execSync(`
    echo "installing web-server dependencies" &&
    rm -rf node_modules &&
    cnpm i &&
    echo "install web-server dependencies success!" &&
    cd ../core/ &&
    echo "installing core dependencies" &&
    rm -rf node_modules &&
    cnpm i &&
    echo "install core dependencies success!"
  `).toString())
  resolve()
}).then(() => {
  return writeExample()
})

function isFile(filepath) {
  try {
    fs.statSync(filepath)
    return true
  } catch (error) {
    return false
  }
}