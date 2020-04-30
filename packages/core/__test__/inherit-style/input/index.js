import React from 'react'
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

export default App