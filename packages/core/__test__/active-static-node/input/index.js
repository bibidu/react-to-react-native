import React from 'react'

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

export default Demo