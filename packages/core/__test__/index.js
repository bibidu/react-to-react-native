const ReactToReactNative = require('../app')

const reactCompString = `
  import React from 'react'
  class T extends React.Component{
    render() {
      return (
        <div>123</div>
      )
    }
  }
`

new ReactToReactNative()
  .init({
    reactCompString
  }).start()