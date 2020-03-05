import React from 'react'
import Black from './foo1'
import './foo.scss'

const Red = () => <h1>red</h1>
const Green = () => <h2>Green</h2>

const App = () => {
  return <>
    <Red />
    <Green />
    <Black />
  </>
}

export default App