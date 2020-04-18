import React from 'react'
import Button from '../Button'
import Modal from '.'
import './preview.scss'


class App1 extends React.Component {
  state = {
    show: false
  }

  toggleModal = () => {
    this.setState({
      show: !this.state.show
    })
  }

  renderModal = () => {
    return this.state.show ? <Modal
      visible={true}
      type="center"
      title={'title'}
      picSrc={"https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=2018939532,1617516463&fm=26&gp=0.jpg"}
      textList={[`我是很长的内容很长的内容`]}
      confirmCBK={this.toggleModal}
      cancelCBK={this.toggleModal}
      clickPicCBK={this.toggleModal}
    /> : null
  }

  render() {
    return (
      <React.Fragment>
        <div rn-scroll="true" className="preview-container">
          <h2>Modal</h2>
          <div className="title">基本类型</div>
          <div className="playground">
            <Button type="primary" onClick={this.toggleModal}>显示Modal弹窗</Button>
          </div>
        </div>
        {this.renderModal()}
      </React.Fragment>
    )
  }
}
export default App1
