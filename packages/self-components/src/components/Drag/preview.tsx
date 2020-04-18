import React from 'react'
import Drag from '.'
import Button from '../Button'
import './preview.scss'

class App1 extends React.Component {
  currentX = 0;

  currentY = 0;

  state = {
    x: 0,
    y: 0,
    drag: false,
  };

  onDragStart = (event, dragState) => {
    // console.log('onDragStart', dragState);

    this.setState({
      drag: true,
    });
  }

  onDragMove = (event, dragState) => {
    // console.log('onDragMove', dragState);

    const { width, height } = this.box.getBoundingClientRect();
    const { width: containerWidth, height: containerHeight } = this.container.getBoundingClientRect();

    let newX = this.currentX + dragState.offsetX;
    let newY = this.currentY + dragState.offsetY;

    if (newX < 0) {
      newX = 0;
    }
    if (newX > containerWidth - width) {
      newX = containerWidth - width;
    }
    if (newY < 0) {
      newY = 0;
    }
    if (newY > containerHeight - height) {
      newY = containerHeight - height;
    }

    this.setState({
      x: newX,
      y: newY,
    });

    return true;
  }

  onDragEnd = (event, dragState) => {
    // console.log('onDragEnd', dragState);

    const { x, y } = this.state;
    this.currentX = x;
    this.currentY = y;

    this.setState({
      drag: false,
    });
  }

  render() {
    const { x, y, drag } = this.state;
    return (
      <div rn-scroll="true" className="preview-container">
        <h2>Drag</h2>
        <div className="title">基本类型</div>
        <div className="playground">
          <div
            ref={(ref) => this.container = ref}
            className="drag-container"
            style={{
              height: 300,
              backgroundColor: '#ddd',
              position: 'relative'
            }}
          >
            <Drag
              onDragStart={this.onDragStart}
              onDragMove={this.onDragMove}
              onDragEnd={this.onDragEnd}
            >
              <div
                ref={(ref) => this.box = ref}
                style={{
                  display: 'inline-block',
                  transform: `translate3d(${x}px, ${y}px, 0)`,
                }}
              >可拖动元素</div>
            </Drag>
          </div>
        </div>

      </div>
    )
  }
}
export default App1
