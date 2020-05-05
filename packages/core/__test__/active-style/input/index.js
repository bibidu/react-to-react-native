import React from 'react'

class App extends React.Component {

  
  render() {
    const { activeStyle } = this.props

    return <div className="container">
      <h1 style={activeStyle}>
        123
      </h1>
    </div>
  }
}

export default App