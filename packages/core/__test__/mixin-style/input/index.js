import React from 'react'
import './app.scss'

class App extends React.Component {

  activeCls = (type) => `${type}-btn`
  
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
        className={`radius20 ${this.activeCls(type)}`}
        id={`${activeWrapper} marginTop10`}
      >
        123
      </div>
    </div>
  }
}

export default App