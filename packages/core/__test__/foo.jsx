import React from 'react'
import './foo.scss'

const H1 = () => <h1 className="green_color">h1</h1>
const H2 = () => <h2>h2</h2>

const App = () => {
  return <>
    <H1 />
    <H2 />
  </>
}

export default App