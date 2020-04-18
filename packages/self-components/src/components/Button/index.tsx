import React from 'react'
import './index.scss'

const noop = () => {}

class Button extends React.Component {
  static defaultProps = {
    type: '',
    size: 'md',
    shape: 'radius',
    disabled: false,
    children: <span>123</span>
  }
  
  getTypeCls = (type) => `btn-${type}-wrapper`
  getSizeCls = (size) => `btn-${size}-size`
  getShapeCls = (shape) => `btn-${shape}-shape`
  getDisabledCls = (disabled) => disabled ? 'btn-disabled-status' : ''
  
  render() {
    const {
      type,
      size,
      shape,
      disabled,
      onClick = noop,
      children,
    } = this.props

    return <button
      disabled={disabled}
      onClick={onClick}
      className={`
        btn-wrapper
        ${this.getTypeCls(type)}
        ${this.getSizeCls(size)}
        ${this.getShapeCls(shape)}
        ${this.getDisabledCls(disabled)}
      `}
    >{children}</button>
  }
}
export default Button