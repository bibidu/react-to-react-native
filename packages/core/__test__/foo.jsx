import React from 'react'
import T1 from './foo1'
import './foo.scss'

class T extends React.Component{
  render() {
    return <h1>
      TTT
      <T1></T1>
    </h1>
  }
}
export default T