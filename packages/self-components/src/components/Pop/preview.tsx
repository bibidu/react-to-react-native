import React from 'react'
import Button from '../Button'
import Pop from '.'
import './preview.scss'


class App1 extends React.Component {
  state = {
    show: false
  }

  togglePop = () => {
    this.setState({
      show: !this.state.show
    })
  }

  renderPop = () => {
    return this.state.show ? <Pop
      visible={true}
      type="center"
      title={'title'}
      picSrc={"https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=2018939532,1617516463&fm=26&gp=0.jpg"}
      textList={[`我是很长的内容很长的内容`]}
      confirmCBK={this.togglePop}
      cancelCBK={this.togglePop}
      clickPicCBK={this.togglePop}
    /> : null
  }
  render() {
    return (
      <div rn-scroll="true" className="preview-container">
        <h2>Pop</h2>
        <div className="title">基本类型</div>
        <div className="playground">
          <Button type="primary" onClick={this.togglePop}>显示Pop弹窗</Button>
        </div>

        {this.renderPop()}
      </div>
    )
  }
}
export default App1
