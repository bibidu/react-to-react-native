const ReactToReactNative = require('../app')

const reactCompString = `
  import React from 'react'
  const t: string = '123'
  class T extends React.Component{
    render() {
      return (
        <div>123</div>
      )
    }
  }
`

const cssString = `
$color: #11f;
body {
  color: $color;
  &:after{
    content: '';
    background: orange;
  }
}
`

new ReactToReactNative()
  .init({
    reactCompString,
    cssString,
  }).start().then((ctx) => {
    // console.log(ctx.afterTsCompiled)
    // console.log(ctx.afterCssCompiled)
  })
