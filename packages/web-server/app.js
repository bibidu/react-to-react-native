const fs = require('fs')
const path = require('path')
const express = require('express')
const app = express()
const r2rn = require('../core/app')
const bodyParser = require('body-parser')
const autoSh = require('./autoSh')
const {
  PORT
} = require('./config')
const markdown = require('markdown-it')
const md = markdown({})

app.all('*',function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*'); //当允许携带cookies此处的白名单不能写’*’
  res.header('Access-Control-Allow-Headers','content-type,Content-Length, Authorization,Origin,Accept,X-Requested-With'); //允许的请求头
  res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT'); //允许的请求方法
  next();
});

app.use(express.static(path.join(__dirname, 'static')))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

function _compile(request) {
  return new Promise(resolve => {
    r2rn.init(request).start().then(res => {
        resolve(res)
      })
  })
}

app.get('/docs', (req, res) => {
  // const html = markdown.makeHtml(docMarkdown)
  // TODO: 改成静态形式，而非每次读取
  const docMd = fs.readFileSync('../../README.md', 'utf8')
  const mdCSS = fs.readFileSync('./static/css/md.css', 'utf8')
  const docHtml = md.render(docMd)
  res.setHeader('Content-Type', 'text/html');
  res.send(docHtml + `<style>${mdCSS}</style>`)
  res.end()
})

app.post('/react2rnWebHook', (req, res) => {
  console.log('react2rnWebHook dispatch!')
  const { timestamp } = req.body.head_commit
  autoSh(timestamp)
})

app.post('/compile', (req, res) => {
  const { reactCompString, cssString } = req.body
  if (reactCompString === undefined || cssString === undefined) {
    res.json({
      code: -1,
      msg: '缺少参数',
      data: {},
    })
  }
  _compile({ reactCompString, cssString }).then(result => {
    res.json({
      code: 0,
      msg: '成功',
      data: { result },
    })
  })
})

app.listen(PORT, () => {
  console.log(`Web Server listening on port ${PORT}!`)
})

process.on('uncaughtException', () => {
  console.log('error');
})
