const ReactToReactNative = require('../app')

const reactCompString = `import React from 'react'

const App =() => {
  return (
    <div className="red_color">
      <h1>react2RN</h1>
    </div>
  )
}

export default App`

const cssString = `.red_color{
  color: red;
}`

const LocalTest = {
  entryPath: `/Users/mr.du/Desktop/bibidu/react-to-react-native/packages/core/__test__/foo.jsx`,
  exportPath: `/Users/mr.du/Desktop/AwesomeReactNativeProject/auto/index.js`
}
const {
  entryPath,
  exportPath,
} = LocalTest

new ReactToReactNative()
  .init({
    // entryPath,
    // exportPath,
    reactCompString,
    cssString,
  }).start().then((finalResult) => {
    console.log('=========finalResult=========')
    console.log()
    console.log(finalResult)
    // console.log(ctx.afterTsCompiled)
    // console.log(ctx.afterCssCompiled)
  })
