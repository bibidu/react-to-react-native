const ReactToReactNative = require('../app')

const reactCompString = `
  import React from 'react'

  function Footer() {
    return (
      <div>footer</div>
    )
  }
  class T extends React.Component{
    renderBody() {
      return [1, 2].map(item => (
        <li>{item}</li>
      ))
    }
    render() {
      return (
        <div id='container'>
          <div id='container-wrapper'>
            <ul className="title">title</ul>
            {
              this.renderBody()
            }
          </div>
        </div>
      )
    }
  }
  export default T
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
