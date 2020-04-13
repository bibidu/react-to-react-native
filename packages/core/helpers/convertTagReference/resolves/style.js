const config = {
  h1: {
    fontSize: '36px',
    fontWeight: '600',
  },
  h2: {
    fontSize: '30px',
    fontWeight: '600',
  },
  h3: {
    fontSize: '24px',
    fontWeight: '600',
  },
  h4: {
    fontSize: '18px',
    fontWeight: '600',
  },
  h5: {
    fontSize: '14px',
  },
  h6: {
    fontSize: '12px',
  },
  button: {
    textAlign: 'center',
  }
}
module.exports = function style(tagName) {
  return config[tagName] || {}
}