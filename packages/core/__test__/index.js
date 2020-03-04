const ReactToReactNative = require('../app')

const reactCompString = `
  import React, { Component } from 'react'
  import './index.css'
  import './foo1'

  class T extends React.Component{
    render() {
      return <div>
        <ul>
          123
        </ul>
      </div>
    }
  }
  export default T
`

const cssString = `
div{
  color: red;
  border: 1px solid #ccc;
  margin: 0 20px;
  font-size: 15px;
}
ul{
  color: green;
}`
const COMPONENT_NAME = 'PopupComment'
// const entryPath = `/Users/duxianzhang/Desktop/company/tz-component-template/src/${COMPONENT_NAME}/index.js`
const entryPath = `/Users/mr.du/Desktop/bibidu/react-to-react-native/packages/core/__test__/foo.jsx`
// const entryPath = `/Users/mr.du/Desktop/react-component-template/template/src/${COMPONENT_NAME}/index.js`
// const exportPath = `/Users/duxianzhang/Desktop/company/tz-component-template/dist_react_native/index.js`
const exportPath = `/Users/mr.du/Desktop/AwesomeReactNativeProject/auto/index.js`
// const reactCompString = ''
// const cssString = ''

new ReactToReactNative()
  .init({
    entryPath,
    exportPath,
    // reactCompString,
    // cssString,
  }).start().then((finalResult) => {
    // console.log('=========finalResult=========')
    // console.log()
    // console.log(finalResult)
    // console.log(ctx.afterTsCompiled)
    // console.log(ctx.afterCssCompiled)
  })
