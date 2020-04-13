import React from 'react'
import Search, { getInitalProps } from '../widgets/search'

const styles = {
  iframe: {
    width: 300,
    height: 600,
  }
}

export default class extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      params: getInitalProps(),
    }
  }

  inputChange = (k, newValue) => {
    console.log(k, newValue)
    const newParams = this.state.params
    newParams[k] = newValue

    this.setState({
      params: newParams
    })
  }

  render() {
    const props = this.state.params
    const eles = []
    Object.entries(this.state.params).forEach(([k, v]) => {
      eles.push(WidgetInputItem(k, v, this.inputChange))
    })

    return (
      <div>
        {eles}
        <Search {...props}/>
        <iframe src="" frameborder="0" style={styles.iframe}>
          
        </iframe>
      </div>
    )
  }
}

function WidgetInputItem(k, v, inputChange) {
  return (
    <div key={k}>
      {k}: <input
        value={v}
        onChange={(e) => {
          const { value } = e.target
          inputChange(k, value)
        }}
        placeholder={`input ${k}`}
      />
    </div>
  )
}