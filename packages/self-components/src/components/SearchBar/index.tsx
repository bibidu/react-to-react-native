import React from 'react'
import './index.scss'
import SearchImg from './imgs/search.png'
import CloseImg from './imgs/close.png'

class SearchBar extends React.Component {

  static defaultProps = {
    shape: 'radius',
    showCancel: false,
    maxLength: 5,
    value: '',
    placeholder: '搜索',
    cancelText: '取消',
    onChange: () => {},
    onCancel: () => {},
    onClear: () => {},
  }

  _searchRef = null

  state = {
    showFakePlaceholder: Boolean(!this.props.value),
    placeholder: this.props.placeholder,
    inputValue: this.props.value,
  }

  focusSearchArea = () => {
    this._searchRef.focus()
    this.setState({
      showFakePlaceholder: false,
      placeholder: this.state.placeholder,
    })
  }

  renderFakePlaceholder = () => {
    return (
      this.state.showFakePlaceholder ? <div className="fake-placeholder-area" onClick={this.focusSearchArea}>
        {
          this.renderSearchIcon()
        }
        <span className="fake-search-text">{this.state.placeholder}</span>
      </div> : null
    )
  }

  renderSearchIcon = () => {
    return (
      <img className="fake-search-img" src={SearchImg} alt=""/>
    )
  }

  renderClearIcon = () => {
    return (
      <img
        className="search-close-img"
        src={CloseImg}
        alt=""
        onClick={() => {
          this.clearInput()
          this.props.onClear()
        }}
      />
    )
  }

  isInput = (e) => {
    const { value } = e.target
    this.setState({
      inputValue: value
    })
    this.props.onChange(value)
  }

  clearInput = () => {
    this.setState({
      inputValue: '',
      showFakePlaceholder: true,
    })
    this.props.onCancel()
  }

  getShapeCls = (shape) => `search-${shape}-shape`

  render() {
    const {
      showFakePlaceholder,
      placeholder,
      inputValue,
    } = this.state
    const {
      shape,
      maxLength,
      cancelText,
      showCancel,
    } = this.props

    return <div className="search-bar-wrapper">
      <div className={`
        search-bar-container
        ${this.getShapeCls(shape)}
      `}>
        {this.renderFakePlaceholder()}
        {!showFakePlaceholder ? this.renderSearchIcon() : null}
        <input
          maxLength={maxLength}
          placeholder={showFakePlaceholder ? '' : placeholder}
          ref={(ref) => this._searchRef = ref}
          className="search-bar-input"
          type="text"
          value={inputValue}
          onChange={this.isInput}
        />
        {/* TODO: 闭包内嵌套闭包场景的fsRelations case */}
        {/* {inputValue.length ? this.renderClearIcon() : null} */}
        {inputValue.length ? <img
          className="search-close-img"
          src={CloseImg}
          alt=""
          onClick={() => {
            this.clearInput()
            this.props.onClear()
          }}
        /> : null}
        
      </div>
      {
        showCancel ? <div className="cancel-btn" onClick={this.clearInput} rn-text>{cancelText}</div> : null
      }
    </div>
  }
}

export default SearchBar