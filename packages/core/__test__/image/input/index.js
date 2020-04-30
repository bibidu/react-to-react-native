import React from 'react'

import wechatImg from 'https://www.baidu.com/wechat.png'
import localImg from './images/avatar.jpeg'

class App extends React.Component {
  render() {
    return <div className="container">
      <img src={wechatImg}></img>
      <img src={localImg}></img>
    </div>
  }
}

export default App