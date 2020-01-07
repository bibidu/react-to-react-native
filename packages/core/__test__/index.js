const ReactToReactNative = require('../app')
const fs = require('fs')

// const reactCompString = `
//   import React from 'react'

//   function Footer() {
//     return (
//       <div>
//         footer
//         <span style={{background: 'red', fontSize: 13}}>34</span>
//         <span>343</span>
//       </div>
//     )
//   }
//   class T extends React.Component{
//     renderBody() {
//       return [1, 2].map(item => (
//         <li>{item}</li>
//       ))
//     }
//     render() {
//       return (
//         <div id='container'>
//           <div id='container-wrapper'>
//             <div>
//               footer
//               <span>34</span>
//               <span>343</span>
//             </div>
//             <ul className="title">title</ul>
//             {
//               this.renderBody()
//             }
//           </div>
//         </div>
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
const testPath = `/Users/duxianzhang/Desktop/company/tz-component-template/src/${COMPONENT_NAME}/index.js`

const reactCompString = fs.readFileSync(testPath, 'utf8')
const cssString = ''
console.log(reactCompString)
new ReactToReactNative()
  .init({
    reactCompString,
    cssString,
  }).start().then((ctx) => {
    // console.log(ctx.afterTsCompiled)
    // console.log(ctx.afterCssCompiled)
  })
