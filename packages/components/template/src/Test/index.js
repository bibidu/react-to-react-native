import React from 'react'
import './index.scss'

const getActiveStyle = () => `active`
const App = function() {
  return <div className="container">
    <div className={`a ${getActiveStyle()} b`}>123</div>
  </div>
}

export default App