import React from 'react'

interface IProps {
  type?: 'success' | 'warning' | 'error',
  message: React.ReactNode,
  count?: number,
  hideToast: () => void
}
interface IState {
  count: number
}

class App extends React.Component<IProps, IState> {
  state = {
    count: 1
  }
  render() {
    return <div className="container">
      ts file
    </div>
  }
}

export default App