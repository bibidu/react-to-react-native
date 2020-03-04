import React from 'react'
import T1 from './foo1'
import './foo.scss'

class T extends React.Component{
  render() {
    return <h1>
      TTT
      <T1>e</T1>
      <T2>e</T2>
    </h1>
  }
}


class T2 extends React.Component{
  render() {
    return <h2>
      h2
    </h2>
  }
}


export default T