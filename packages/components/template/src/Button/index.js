import React from 'react';
import './index.scss'

class Button extends React.Component {

  getBtnClass(type) {
    return `${type}-btn`
  }

  defaultClickEvent() {
    alert('defaultClickEvent')
  }

  render() {
    const {
      type,
      text,
      onClickBack,
      children
    } = this.props
    return <button
        className={`btn ${this.getBtnClass(type)}`}
        onClick={onClickBack || this.defaultClickEvent}
        style={{content: ''}}
      >
      {
        text && <span>{text}</span>
      }
    </button>
  }
}

class App extends React.Component {
  callback(params) {
    alert('onClick callback')
  }
  render() {
    return (
      <div>
        <h3 className="myh3" style={{color: 'red'}}>13</h3>
        <Button type="primary" onClickBack={this.callback} text="123">
        </Button>
        <Button type="dashed" onClickBack={this.callback} text="123">
        </Button>
        <Button type="link" onClickBack={this.callback} text="123">
        </Button>
        <Button type="danger" onClickBack={this.callback} text="123">
        </Button>
      </div>
    )
  }
}

export default App