import React from 'react'
import './index.scss'

class PopupComment extends React.PureComponent {
  state = {
    inputValue: ''
  }

  changeInput = (e) => {
    this.setState({
      inputValue: e.target.value
    })
  }

  publish = () => {
    const { type } = this.props
    this.props.onComment(this.state.inputValue)
    this.props.onClose()
    this.setState({
      inputValue: ''
    })
  }
  tapContainer = () => {
    this.props.onClose()
  }

  tapValid = (e) => {
    e.stopPropagation()
  }

  onInputFocus = () => {
    // const input = document.getElementById('popup-input')
    // const len = input.value.length
    // // 聚焦到最后一个字
    // if (input.setSelectionRange) {
    //   input.focus()
    //   input.setSelectionRange(len, len)
    // } else if (input.createTextRange) {
    //   let range = input.createTextRange()
    //   range.collapse(true)
    //   range.moveEnd('character', len)
    //   range.moveStart('character', len)
    //   range.select()
    // }
  }

  render () {
    const { inputValue } = this.state
    const {
      title = '发表评论',
      leftBtnText = '取消',
      rightBtnText = '发布',
      onClose,
      placeholder = '理性发言，阳光评论'
    } = this.props
    return (
      <div className="popup-comment-container" onClick={this.tapContainer}>
        <div className="popup-comment-wrapper" onClick={this.tapValid}>
          <div className="popup-comment-top-area">
            <button className="button" onClick={onClose}>
              <span>{leftBtnText}</span>
            </button>
            <span className="title">{title}</span>
            <button
              onClick={this.publish}
              className='button publish'
              disabled={
                inputValue.length === 0 || inputValue.trim() === ''
              }
            >
              <span>{rightBtnText}</span>
            </button>
          </div>
          <div className="popup-comment-input-wrapper">
            <textarea
              style={
                {
                  fontSize: '15px'
                }
              }
              className="popup-comment-input"
              id="popup-input"
              autoFocus
              onFocus={this.onInputFocus}
              onChange={this.changeInput}
              placeholder={placeholder}
              value={inputValue}
              name=""
              cols="30"
              rows="10">
            </textarea>
          </div>
        </div>
      </div>
    )
  }
}

export default PopupComment
