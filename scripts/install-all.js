const { execSync } = require('child_process')

const commands = `
  cd packages/components/template &&
  npm install &&
  cd ../.. &&
  cd core &&
  npm install &&
  cd .. &&
  cd web-server &&
  npm install &&
  echo "install-all dependencies success !"
`

console.log(execSync(commands).toString());