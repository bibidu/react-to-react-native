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
let iframe // 当前的iframe实例

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
  window.addEventListener('message', (e) => {
    console.log(e.data);
  })
  const iframeContainer = document.querySelector('.iphone-frame-container')

  iframe = document.createElement('iframe')
  iframe.setAttribute('frameborder', '0')
  iframe.setAttribute('id', 'iphone-iframe')
  Array.from(iframeContainer.childNodes).forEach(item => item.tagName === 'IFRAME' && item.remove())
  iframeContainer.appendChild(iframe)
  const ifrw = iframe.contentWindow
  
  value = value
    .replace('</body>', `
    <script src="http://yushouxiang.com:3000/js/html_clone.js"></script>
    <script>
    window.addEventListener('message', (ev) => {
      parent.postMessage(setup(document.body), '*')
    })
    </script>
    </body>`)
  ifrw.document.open()
  ifrw.document.write(value)
  ifrw.document.close()
}

function getIframeHtml() {
  iframe.contentWindow.postMessage({ data: '12x' }, '*')
}

function setDefaultValue() {
  mirror.setValue(defaultContent)
}

function serilizeCode() {
  let style
  const html = mirror.getValue().replace(/\<style\>([\w\W]*)\<\/style\>/m, (_, _style) => {
    style = _style
    return '<style></style>'
  })
  style = cssbeautify(style)
  
  fetch('//r2rn.bib1du.com/format/html', {
    method: 'POST',
    headers: { 
      "Content-Type": "application/json",
    }, 
    body: JSON.stringify({ html })
  }).then(res => res.json()).then((res) => {
    const html = res.data.fhtml
    if (html) {
      mirror.setValue(html.replace('<style>', `<style>${style}\n`))
    }
  })
}

function toggleDevice(deviceName, index) {
  const deviceSizeMap = {
    'iPhone 6s': { width: 375, height: 667 },
    'iPhone X': { width: 375, height: 812 },
  }
  const mapSize = deviceSizeMap[deviceName] || {}
  if (Object.keys(mapSize).length) {
    // 设置手机宽高
    const container = document.querySelector('.iphone-frame-container')
    container.style.width = mapSize.width * 0.9 + 'px'
    container.style.height = mapSize.height * 0.9 + 'px'
    console.log(`切换到 ${mapSize.width}, ${mapSize.height}`)
    // 切换tab样式
    const devices = document.querySelectorAll('.device')
    Array.from(devices).forEach((item, idx) => {
      const darkCls = idx === index ? ['dark'] : []
      item.classList = (Array.from(item.classList) || [])
        .filter(cls => cls !== 'dark')
        .concat(darkCls)
        .join(' ')
    })
  }
}

