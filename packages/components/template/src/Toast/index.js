
import React, { Component } from 'react';
import './Toast.scss';
import successIcon from './static/img/tz-toast-success.png'
import errorIcon from './static/img/tz-toast-error.png'
import warnIcon from './static/img/tz-toast-warn.png'

class Toast extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: this.props.count || 222000,
    }
  }
  componentDidMount() {
    this.showHandle();
  }
  // 两秒后关闭当前toast
  showHandle() {
    const {count} = this.state;
    const {hideToast} = this.props;
    let timer = setTimeout(()=>{
      clearTimeout(timer);
      hideToast && hideToast();
    }, count)
  }

  getIconUrl(type) {
    const urls = {
      'success-icon': successIcon,
      'error-icon': errorIcon,
      'warn-icon': warnIcon
    }
    return urls[type]
  }
  // 渲染组件
  renderToast() {
    const { type, message } = this.props;
    // 带图标
    let iconType = typeof type === 'undefined' ? 'no-icon' : type;
    let iconClass = '';
    switch (iconType) {
      case 'success':
        iconClass = 'success-icon';
        break;
      case 'warning':
        iconClass = 'warn-icon';
        break;
      case 'error':
        iconClass = 'error-icon';
        break;
      default:
        iconClass = 'no-icon';
        break;
    }
    // 不带图标
    return (
      <>
        <div className="toast-container">
        {
          type ? <div className={`tz-toast-wrap ${iconClass !== 'no-icon' ? 'has-icon-wrap' : ''}`} >
            <img src={this.getIconUrl(iconClass)} className={`tz-toast-icon-base ${iconClass}`}></img>
            <span className="tz-toast-message">{message}</span>
          </div> : null
        }
        </div>
      </>
    )
  }

  render() {
    return <>{this.renderToast()}</>
  }
}
class T extends Component{
  constructor(p) {
    super(p)
    this.state = { type: 'success' }
  }
  render() {
    return <Toast type={this.state.type} hideToast={() => this.setState({ type: '' })} message="toast" />
  }
}

export default T
