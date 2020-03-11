const config = {
  h1: {
    fontSize: '36px'
  },
  h2: {
    fontSize: '30px'
  },
  h3: {
    fontSize: '24px'
  },
  h4: {
    fontSize: '18px'
  },
  h5: {
    fontSize: '14px'
  },
  h6: {
    fontSize: '12px'
  },
  button: {
    textAlign: 'center'
  }
}
module.exports = function style(tagName) {
  return config[tagName] || {}
}