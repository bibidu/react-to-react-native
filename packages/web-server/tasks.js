const fs = require('fs')
const os = require('os')
const publicIp = require('public-ip')

const ENTRY = './static/index.html'

const html = fs.readFileSync(ENTRY, 'utf8')

publicIp.v4().then(ip => {
  console.log(`ip ${ip}`)
  fs.writeFileSync(ENTRY, html.replace(/localhost/g, ip), 'utf8')
})


function getIPAdress() {
  var interfaces = os.networkInterfaces();
  for (var devName in interfaces) {
      var iface = interfaces[devName];
      for (var i = 0; i < iface.length; i++) {
          var alias = iface[i];
          if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
              return alias.address;
          }
      }
  }
}
