import React from 'react'
import SearchBar from '../SearchBar'
import './preview.scss'


class App1 extends React.Component {
  render() {
    return (
      <div rn-scroll="true" className="preview-container">
        <h2>SearchBar</h2>
        <div className="title">基本类型</div>
        <div className="playground">
          <SearchBar />
        </div>
        <div className="title">始终展示取消按钮</div>
        <div className="playground">
          <SearchBar showCancel={true} />
        </div>

        <div className="title">多形状</div>
        <div className="playground">
          <SearchBar shape="radius"/>
          <SearchBar shape="rect"/>
          <SearchBar shape="round"/>
        </div>

      </div>
    )
  }
}
export default App1
