const fs = require('fs')
const os = require('os')
const publicIp = require('public-ip')

const ENTRY = './static/index.html'

const html = fs.readFileSync(ENTRY, 'utf8')

publicIp.v4().then(ip => {
  console.log(`ip ${ip}`)
  fs.writeFileSync(ENTRY, html.replace(/localhost/g, ip), 'utf8')
})

const dir = './static/index.html'
fs.writeFileSync(dir, fs.readFileSync(dir, 'utf8') + `<script>
  document.querySelector('.last-update').innerText = ${timestamp}
</script>` , 'utf8')

