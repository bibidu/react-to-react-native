import React from 'react'
const { Fragment } = React

function App() {
  return <>
    <div>567</div>
  </>
}

class ClassApp extends React.Component {
  render() {
    return <React.Fragment>
      <div>123</div>
      <App>
        <Fragment>
          <span>444</span>
          <span>555</span>
        </Fragment>
      </App>
    </React.Fragment>
  }
}

export default ClassApp