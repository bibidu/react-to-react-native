const chalk = require('chalk')

const logInfoByType = {
  log: {
    prefix: 'logger',
    color: 'blue',
  },
  flow: {
    prefix: 'flow',
    color: 'blue',
  },
  spendTime: {
    prefix: '耗时',
    color: 'magenta'
  },
  entry: {
    prefix: '入口',
    color: 'green',
  },
  copy: {
    prefix: '拷贝',
    color: 'green',
  },
  output: {
    prefix: '输出',
    color: 'green',
  },
}
exports.name = 'logger'

exports.error = msg => {
  console.log()
  console.log(`[ERROR]${msg}`)
  console.log()
  // throw Error(msg)
}

exports.log = ({ type, msg, }) => {
  const { prefix, color } = logInfoByType[type] || logInfoByType.log
  
  console.log(chalk[color](`[${prefix}]`) + msg);
}