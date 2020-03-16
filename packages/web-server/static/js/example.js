const examples = [
  {
    title: '标签默认样式',
    inputJs: 
`import React from 'react'

const App = () => {
  return <h1 className="bold">react2RN</h1>
}

export default App`,
    inputCss:
`h1{
  line-height: 30px;
}
.bold{
    font-weight: bold;
}
`
  },
  {
    title: '添加rn-text标记',
    inputJs:
`import React from 'react'

  
class App extends React.Component {

  bar = (value) => <div rn-text>{value}</div>

  render() {
	return <div>{this.bar(123)}</div>
  }
}

export default App
`,
    inputCss: ''
  },
  {
    title: 'background:url()支持',
    inputJs:
`import React from 'react'

const App = () => {
  return <i className="static-i"></i>
}

export default App`,
    inputCss:
`.static-i{
	background: url('./static/img/tz-toast-success.png');

}`,
  }
]