module.exports = function generateInjectBrowserScript({ html, css }) {
  const { externalStyle } = css
  const script = `document.body.innerHTML = \`${html}\`
  document.body.appendChild(create('div', { id: 'result' }))
  const styles = ${JSON.stringify(externalStyle)}
  const output = {}
  Object.entries(styles).forEach(([ selector, style ]) => {
    const el = element(selector)
    if (el) {
      const uniqueId = attr(el, 'uniqueId')
      if (uniqueId) {
        output[uniqueId] = style
      }
    }
  })
  element('#result').innerText = JSON.stringify(output)

  /********    工具方法 start    ***********/
  
  function create(tagName, attrs) {
    const tag = document.createElement(tagName)
    if (attrs && Object.keys(attrs).length) {
      Object.entries(attrs).forEach(([key, value]) => {
        if (key === 'id' || key === 'class') {
          tag[key] = value
        }
      })
    }
    return tag
  }
  function element(selector) { return document.querySelector(selector) }
  function attr(el, attrName) { return el.getAttribute(attrName) }

  /********    工具方法 end    ***********/

  `
  return script
}