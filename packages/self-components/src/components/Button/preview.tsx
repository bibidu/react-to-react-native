import React from 'react'
import Button from '.'
import './preview.scss'

function App1() {
  return (
    <div rn-scroll className="preview-container">
      <h2>Button</h2>
      <div className="title">基本类型</div>
      <div className="playground">
        <Button>default</Button>
        <Button disabled={true}>禁用</Button>
      </div>
      <div className="title">按钮主题</div>
      <div className="playground">
        <Button>default</Button>
        <Button type="primary">primary</Button>
        <Button type="danger">danger</Button>
      </div>

      <div className="title">按钮尺寸</div>
      <div className="playground">
        <Button size="xs">xs</Button>
        <Button size="sm">sm</Button>
        <Button size="md">md</Button>
        <Button size="lg">lg</Button>
      </div>

      <div className="title">按钮形状</div>
      <div className="playground">
        <Button shape="circle">circle</Button>
        <Button shape="round">round</Button>
        <Button shape="rect">rect</Button>
        <Button shape="radius">radius</Button>
      </div>
    </div>
  )
}
export default App1