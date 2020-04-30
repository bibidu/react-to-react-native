import React from 'react'
import './app.scss'

class App extends React.Component {

  activeCls = (type) => `tz-${type}-btn`
  
  render() {
    const { type } = this.props

    return <div className="container">
      <h1 className={`default-btn ${this.activeCls(type)}`}>
        123
      </h1>
    </div>
  }
}

export default App