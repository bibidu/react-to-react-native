import React from 'react'
import Calendar from '.'
import './preview.scss'

function App1() {
  return (
    <div rn-scroll className="preview-container">
      <h2>Calendar</h2>
      <div className="title">基本类型</div>
      <div className="playground">
        <Calendar></Calendar>
      </div>
    </div>
  )
}
export default App1