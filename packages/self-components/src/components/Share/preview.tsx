import React from 'react'
import Button from '../Button'
import Share from '.'
import './preview.scss'


class App1 extends React.Component {
  state = {
    show: false
  }

  toggleShare = () => {
    this.setState({
      show: !this.state.show
    })
  }

  renderShare = () => {
    return this.state.show ? <Share
      onShare={this.toggleShare}
      onCancel={this.toggleShare}
    /> : null
  }

  render() {
    return (
      <div rn-scroll="true" className="preview-container">
        <h2>Share</h2>
        <div className="title">基本类型</div>
        <div className="playground">
          <Button type="primary" onClick={this.toggleShare}>分享</Button>
        </div>

        {this.renderShare()}
      </div>
    )
  }
}
export default App1
