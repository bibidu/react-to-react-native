import React from 'react'

class App extends React.Component {

  tapButton = (e) => {
    const { value } = e.target
    console.log(`tap button ${value}`)
  }
  render() {
    return <div>
      <button onClick={this.tapButton}>
        base event
      </button>

      <div
        onClick={ev => this.tapButton({
          event: Object.assign({}, { test: 123 }, () => { t: ev.currentTarget }),
          value: ev,
        })}
      >
        complex event
      </div>
    </div>
  }
}
export default App