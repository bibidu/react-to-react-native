const ReactToReactNative = require('../app')
const fs = require('fs')

const reactCompString = `
  import React from 'react'

  function T() {
    return (
      <button
        onClick={() => {}}
        rn-text
      >
        <span style={{color: 'green'}}>{text}</span>
      </button>
    )
  }
  // class T extends React.Component{
  //   render() {
  //     return <div></div>
  //   }
  // }
  export default T
`

const cssString = ``
const COMPONENT_NAME = 'BUTTON'
// const reactCompPath = `/Users/duxianzhang/Desktop/company/tz-component-template/src/${COMPONENT_NAME}/index.js`
// const reactCompPath = `/Users/mr.du/Desktop/react-component-template/template/src/${COMPONENT_NAME}/index.js`
// const outputPath = `/Users/duxianzhang/Desktop/company/tz-component-template/dist_react_native/index.js`
// const outputPath = `/Users/mr.du/Desktop/AwesomeReactNativeProject/auto/index.js`
// const reactCompString = ''
// const cssString = ''

new ReactToReactNative()
  .init({
    // reactCompPath,
    // outputPath,
    reactCompString,
    cssString,
  }).start().then((finalResult) => {
    console.log('=========finalResult=========')
    console.log()
    console.log(finalResult)
    // console.log(ctx.afterTsCompiled)
    // console.log(ctx.afterCssCompiled)
  })
