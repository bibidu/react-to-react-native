const defaultContent = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Hello React!</title>
    <script src="https://cdn.staticfile.org/react/16.4.0/umd/react.development.js"></script>
    <script src="https://cdn.staticfile.org/react-dom/16.4.0/umd/react-dom.development.js"></script>
    <script src="https://cdn.staticfile.org/babel-standalone/6.26.0/babel.min.js"></script>
  </head>
  <body>

    <div id="app"></div>

    <script type="text/babel">
    ReactDOM.render(
      <h1>Hello, world!</h1>,
      document.getElementById('app')
    );
    </script>
  </body>
</html>
`
let mirror // codemirror实例

createCodeMirror()

function createCodeMirror() {
  const el = document.querySelector('.code-container')
  mirror = CodeMirror.fromTextArea(
    el,
    Object.assign({}, {
      mode: "jsx",
      lineNumbers: false,// 显示行号
      smartIndent: true , //智能缩进
      indentUnit: 2, // 智能缩进单位为4个空格长度
      indentWithTabs: true,  // 使用制表符进行智能缩进
      lineWrapping: true,
    })
  )
  setDefaultValue()
  runCode()
  mirror.on("change", (v) => {
  });
}

function runCode(value) {
  value = value || mirror.getValue()
  createAndReplaceIframe(value)
}

function createAndReplaceIframe(value) {
  const iframeContainer = document.querySelector('.demo-frame')

  const iframe = document.createElement('iframe')
  iframe.setAttribute('frameborder', '0')
  iframe.setAttribute('id', 'iphone-iframe')
  Array.from(iframeContainer.childNodes).forEach(item => item.tagName === 'IFRAME' && item.remove())
  iframeContainer.appendChild(iframe)
  const ifrw = iframe.contentWindow
  ifrw.document.open()
  ifrw.document.write(value)
  ifrw.document.close()
}

function setDefaultValue() {
  mirror.setValue(defaultContent)
}

function serilizeCode() {
  fetch('http://39.107.227.103:3000/format/html', {
    method: 'POST',
    headers: { 
      "Content-Type": "application/json",
    }, 
    body: JSON.stringify({
      html: mirror.getValue()
    })
  }).then(res => res.json()).then((res) => {
    const html = res.data.fhtml
    if (html) {
      mirror.setValue(html)
    }
  })
}