import React from 'react'
import FunctionComponentWrapper from '@src/components/FunctionComponentWrapper'
import './index.scss'

class PopupComment extends React.PureComponent {
  state = {
    inputValue: '',
    focus: false
  }

  changeInput = (e) => {
    this.setState({
      inputValue: e.target.value
    })
  }

  publish = () => {
    if (!this.props.onPublish || typeof this.props.onPublish !== 'function') {
      throw '"props.onPublish" should be a function!'
    }
    console.log(123)
    this.props.onPublish({
      inputValue: this.state.inputValue,
    })
  }

  tapClose = () => {
    if (!this.props.onClose || typeof this.props.onClose !== 'function') {
      throw '"props.onClose" should be a function!'
    }
    this.props.onClose()
  }

  tapContainer = () => {
    const { onTapContainer, onClose } = this.props
    if (onTapContainer) {
      onTapContainer()
    } else {
      onClose()
    }
  }

  tapValid = (e) => {
    e.stopPropagation()
  }

  render () {
    const { inputValue } = this.state
    const {
      title = '发表评论',
      cancelText = '取消',
      confirmText = '发布',
      placeholder = '理性发言，阳光评论',
      publishDisableValidator = (inputValue) => !inputValue || !inputValue.trim().length
    } = this.props
    return (
      <div className="popup-comment-container" onClick={this.tapContainer}>
        <div className="popup-comment-wrapper" onClick={this.tapValid}>
          <div className="popup-comment-top-area">
            <button className="button" onClick={this.tapClose}>{cancelText}</button>
            <span className="title">{title}</span>
            <button
              onClick={this.publish}
              className='button publish'
              disabled={publishDisableValidator(inputValue)}
            >{confirmText}</button>
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
function functionalComment ({params}) {
  return <PopupComment {...params}/>
}

export default FunctionComponentWrapper(functionalComment, {
  idSelector: 'global-popup-comment'
})
