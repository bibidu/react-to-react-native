const fs = require('fs')
const { execSync } = require('child_process')

module.exports = function(timestamp) {
  const commands = `
    git checkout . &&
    git pull origin &&
    cd /usr/application/github/react-to-react-native/packages/web-server &&
    npm run predeploy &&
    pm2 restart 1
  `
  console.log(execSync(commands).toString())

}
