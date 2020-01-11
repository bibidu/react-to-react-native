const ReactToReactNative = require('../app')
const fs = require('fs')

// const reactCompString = `
//   import React from 'react'

//   class T extends React.Component{
//     renderBody() {
//       return [1, 2].map(item => (
//         <li>{item}</li>
//       ))
//     }
//     render() {
//       return (
//         <button
//           onClick={() => {}}
//           rn-text
//         >
//           <span style={{color: 'green'}}>{text}</span>
//         </button>
//       )
//     }
//   }
//   export default T
// `

// const cssString = `
// $color: #11f;
// ul {
//   color: $color;
//   &:after{
//     content: '';
//     background: orange;
//   }
// }
// `
const COMPONENT_NAME = 'BUTTON'
// const reactCompPath = `/Users/duxianzhang/Desktop/company/tz-component-template/src/${COMPONENT_NAME}/index.js`
const reactCompPath = `/Users/mr.du/Desktop/react-component-template/template/src/${COMPONENT_NAME}/index.js`
// const outputPath = `/Users/duxianzhang/Desktop/company/tz-component-template/dist_react_native/index.js`
const outputPath = `/Users/mr.du/Desktop/react-component-template/template/dist_react_native/index.js`
// const reactCompString = ''
// const cssString = ''

new ReactToReactNative()
  .init({
    reactCompPath,
    outputPath,
    // reactCompString,
    // cssString,
  }).start().then((finalResult) => {
    // console.log('=========finalResult=========')
    // console.log()
    // console.log(finalResult)
    // console.log(ctx.afterTsCompiled)
    // console.log(ctx.afterCssCompiled)
  })
