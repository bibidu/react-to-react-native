import React from 'react'
import Button from '../Button'
import PopupComment from '.'
import './preview.scss'


class App1 extends React.Component {
  state = {
    show: false
  }

  togglePopupComment = () => {
    this.setState({
      show: !this.state.show
    })
  }

  renderPopupComment = () => {
    return this.state.show ? <PopupComment
      title={'标题1'}
      leftBtnText={'取消1'}
      rightBtnText={'发布1'}
      onComment={this.togglePopupComment}
      onClose={this.togglePopupComment}
    /> : null
  }
  render() {
    return (
      <div rn-scroll="true" className="preview-container">
        <h2>PopupComment</h2>
        <div className="title">基本类型</div>
        <div className="playground">
          <Button type="primary" onClick={this.togglePopupComment}>显示Popup评论弹窗</Button>
        </div>

        {this.renderPopupComment()}
      </div>
    )
  }
}
export default App1
