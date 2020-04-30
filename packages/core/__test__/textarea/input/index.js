import React from 'react'
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

export default App