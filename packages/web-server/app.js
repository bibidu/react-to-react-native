const express = require('express')
const r2rn = require('../core/app')
const app = express()

/* static */
const PORT = 3000

function _compile(request) {
  return new Promise(resolve => {
    new r2rn().init(request).start().then(res => {
        resolve(res)
      })
  })
}

app.get('/compile', (req, res) => {
  const { reactCompString, cssString } = req.query
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