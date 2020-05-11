const fs = require('fs')
// const publicIp = require('public-ip')
const { execSync } = require('child_process')

const ENTRYS = [
  './static/index.html',
  './static/js/index.js',
]

// publicIp.v4().then(ip => {
//   console.log(`ip ${ip}`)
ENTRYS.forEach(ENTRY => {
    const content = fs.readFileSync(ENTRY, 'utf8')
    fs.writeFileSync(ENTRY, content.replace(/http:\/\/localhost/g, 'https://www.yushouxiang.com'), 'utf8')
})
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
