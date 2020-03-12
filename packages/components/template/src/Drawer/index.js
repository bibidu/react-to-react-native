import React from 'react';
import './index.scss'

class Drawer extends React.Component{

  tapGrayLayer = () => {
    const { tapGrayLayer } = this.props
    tapGrayLayer && tapGrayLayer()
  }
  render() {
    const { children } = this.props
    return <div className="drawer-container" onClick={this.tapGrayLayer}>
      <div className="drawer" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  }
}

class D extends React.Component{
  state = {
    show: false
  }

  tapGrayLayer = () => {
    this.setState({
      show: false
    })
  }

  render() {
    return <>
      {
        this.state.show ? <Drawer
        tapGrayLayer={this.tapGrayLayer}
        >
        <div className="test-title">自定义内容</div>
        <div className="test-action">Action1</div>
        <li className="test-content">do something1</li>
        <li className="test-content">do something2</li>
        </Drawer> : <button className="test-btn" onClick={() => this.setState({show: true})}>显示Drawer</button>
      }
    </>
  }
}

export default D