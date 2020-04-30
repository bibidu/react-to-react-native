const examples = [
{
            title: `active-classname`,
            inputJs: `import React from 'react'
import './app.scss'

class App extends React.Component {

  activeCls = (type) => \`tz-\${type}-btn\`
  
  render() {
    const { type } = this.props

    return <div className="container">
      <h1 className={\`default-btn \${this.activeCls(type)}\`}>
        123
      </h1>
    </div>
  }
}

export default App`,
            inputCss: `.default-btn{
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.danger-btn{
  /* stable: tz-danger-btn */
  background: red;
  color: #fff;
}
.warn-btn{
  /* stable: tz-warn-btn */
  background: yellow;
  color: #fff;
}`,
          },

{
            title: `active-static-node`,
            inputJs: `import React from 'react'

class App extends React.Component {
  render() {
    return <div className="container">
      {this.props.children}
      <div>456</div>
    </div>
  }
}

class Demo extends React.Component {
  render() {
    const value = 123
    return <App rn-text>{value}</App>
  }
}

export default Demo`,
            inputCss: ``,
          },

{
            title: `class`,
            inputJs: `import React from 'react'
import './app.scss'

class App extends React.Component {
  render() {
    return <div className="container">
      base class
    </div>
  }
}

export default App`,
            inputCss: `.container{
  padding: 10px 20px;
  margin: 10px;
  background: #ccc;
}`,
          },

{
            title: `dom-event`,
            inputJs: `import React from 'react'

class App extends React.Component {

  tapButton = (e) => {
    const { value } = e.target
    console.log(\`tap button \${value}\`)
  }
  render() {
    return <div>
      <button onClick={this.tapButton}>
        base event
      </button>

      <div
        onClick={ev => this.tapButton({
          event: Object.assign({}, { test: 123 }, () => { t: ev.currentTarget }),
          value: ev,
        })}
      >
        complex event
      </div>
    </div>
  }
}
export default App`,
            inputCss: ``,
          },

{
            title: `fragment`,
            inputJs: `import React from 'react'
const { Fragment } = React

function App() {
  return <>
    <div>567</div>
  </>
}

class ClassApp extends React.Component {
  render() {
    return <React.Fragment>
      <div>123</div>
      <App>
        <Fragment>
          <span>444</span>
          <span>555</span>
        </Fragment>
      </App>
    </React.Fragment>
  }
}

export default ClassApp`,
            inputCss: ``,
          },

{
            title: `image`,
            inputJs: `import React from 'react'

import wechatImg from 'https://www.baidu.com/wechat.png'
import localImg from './images/avatar.jpeg'

class App extends React.Component {
  render() {
    return <div className="container">
      <img src={wechatImg}></img>
      <img src={localImg}></img>
    </div>
  }
}

export default App`,
            inputCss: ``,
          },

{
            title: `inherit-style`,
            inputJs: `import React from 'react'
import './app.scss'

class App extends React.Component {
  render() {
    return <>
      <div className="lineHeight10" style={{fontWeight: 'bold'}}>
        <h1 style={{background: 'red', color: 'red'}}>h1</h1>
      </div>
    </>
  }
}

export default App`,
            inputCss: `.lineHeight10{
	line-height: 10px;
}`,
          },

{
            title: `mixin-style`,
            inputJs: `import React from 'react'
import './app.scss'

class App extends React.Component {

  activeCls = (type) => \`\${type}-btn\`
  
  activeStyle = (type) => ({
    padding: type ? '15px' : '20px',
    border: '1px solid #ccc',
  })

  render() {
    const { type } = this.props
    const defaultStyle = {
      marginTop: 5,
    }
    const activeWrapper = 'abc'

    return <div className="container">
      <div
        style={Object.assign(defaultStyle, this.activeStyle(type))}
        className={\`radius20 \${this.activeCls(type)}\`}
        id={\`\${activeWrapper} marginTop10\`}
      >
        123
      </div>
    </div>
  }
}

export default App`,
            inputCss: `.container{
  background: red;
  color: green;
  .radius20{
    border-radius: 20px;
  }
  .abc{
    padding: 5px 10px 2px;
  }
  #marginTop10{
    margin: 10px 0 0;
  }
}`,
          },

{
            title: `pure-class`,
            inputJs: `import React from 'react'
import './app.scss'

function App() {
  return <div className="container">
    <div id="colorRed">
      123
    </div>
  </div>
}

export default App`,
            inputCss: `.container{
  background: green;
  margin: 10px 20px;
  padding: 20px 2px;
  border-bottom: 1px solid;
  #colorRed{
    color: red;
  }
}`,
          },

{
            title: `textarea`,
            inputJs: `import React from 'react'
import './app.scss'

class App extends React.Component {
  render() {
    return <textarea 
      onChange={(e) => console.log(e.target.value)}
      onBlur={e => console.log('blur', e.target.value)}
      className="textarea" 
      name="my-textarea" 
      cols="30" 
      rows="10"
      autoFocus
      disabled
      maxLength={8}
      readOnly
    ></textarea>
  }
}

export default App`,
            inputCss: `.textarea{
  border: 1px solid #ccc;
  background: #eee;
}`,
          },

{
            title: `tsfile`,
            inputJs: `import React from 'react'

interface IProps {
  type?: 'success' | 'warning' | 'error',
  message: React.ReactNode,
  count?: number,
  hideToast: () => void
}
interface IState {
  count: number
}

class App extends React.Component<IProps, IState> {
  state = {
    count: 1
  }
  render() {
    return <div className="container">
      ts file
    </div>
  }
}

export default App`,
            inputCss: ``,
          },

{
            title: `with-style-tag`,
            inputJs: `import React from 'react'
import './app.scss'

class App extends React.Component {
  render() {
    return <>
      <h1>h1</h1>
      <h2>h2</h2>
      <h3>h3</h3>
      <h4>h4</h4>
      <h5>h5</h5>
      <h6>h6</h6>
    </>
  }
}

export default App`,
            inputCss: ``,
          },
]