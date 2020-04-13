import React, { Component } from 'react'

interface IProps {
  placeholder: string
  searchCancelText: string
}

const styles = {
  searchWrapper: {
    width: '100%',
    height: 50,
    background: '#20212A',
    display: 'flex',
    alignItems: 'center',
    padding: '0 15px',
    boxSizing: 'border-box',
  },
  searchInput: {
    flex: 1,
    height: 30,
    borderRadius: 16,
    background: '#3D3E4E',
    color: '#FFFFFF',
    border: 'none',
    textIndent: 20,
  },
  cancelBtn: {
    marginLeft: 15,
    color: '#fff',
    fontSize: 17,
  }
}

export default class T extends Component<IProps, any> {

  static defaultProps = getInitalProps()

  render() {
    const {
      placeholder,
      searchCancelText
    } = this.props

    return <div style={styles.searchWrapper}>
      <input style={styles.searchInput} type="text" placeholder={placeholder}/>
      <div style={styles.cancelBtn}>{searchCancelText}</div>
    </div>
  }
}

export function getInitalProps() {
  return {
    placeholder: '请输入...',
    searchCancelText: '取消'
  }
}