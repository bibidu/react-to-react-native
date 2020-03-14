const fs = require('fs')
const os = require('os')
const publicIp = require('public-ip')
const { execSync } = require('child_process')

const ENTRY = './static/index.html'

const html = fs.readFileSync(ENTRY, 'utf8')

publicIp.v4().then(ip => {
  console.log(`ip ${ip}`)
  return  fs.writeFileSync(ENTRY, html.replace(/localhost/g, ip), 'utf8')
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
})
