import * as React from 'react';
import './index.scss';

class Pop extends React.Component {
  constructor(props) {
    super(props);
  }

  handleConfirm= (e) => {
    console.log(e);
    this.props.confirmCBK && this.props.confirmCBK(this.props.type);
  };

  handleCancel= (e) => {
    console.log(e);
    this.props.cancelCBK && this.props.cancelCBK(this.props.type);
  };

  handleClickPic= (e) => {
    console.log(e);
    this.props.clickPicCBK && this.props.clickPicCBK(this.props.type);
  };

  // 渲染组件 center
  centerRenderPop() {
    return (
      <div className="absolute-location">
        {this.props.visible&&<div className="m-popLayer">
          <div className="w-main">
            <div className="w-content">
              <div className="w-h1 tac clamp1">
                <span>{this.props.title}</span>
              </div>
              <div className="w-p">
                <div className="p tac">
                  <span>{this.props.textList[0]}</span>
                </div>
              </div>
            </div>
            <div className="w-btn">
              <div className="btn l " onClick={this.handleCancel}>取消</div>
              <div className="btn r on" onClick={this.handleConfirm}>确认</div>
            </div>
          </div>
        </div>}
      </div>
    );
  }

  // 渲染组件 left
  leftRenderPop() {
    return (
      <div>
        {this.props.visible&&<div className="m-popLayer">
          <div className="w-main">
            <div className="w-content">
              <div className="w-h1 tac clamp1">
                <span>{this.props.title}</span>
              </div>
              <div className="w-p">
                {this.props.textList.map((item,index)=><div className="p" key={'key'+index}>
                  <span>{item}</span>
                </div>)}
              </div>
            </div>
            <div className="w-btn">
              <div className="btn l " onClick={this.handleCancel}>取消</div>
              <div className="btn r on" onClick={this.handleConfirm}>确认</div>
            </div>
          </div>
        </div>}
      </div>
    );
  }

  // 渲染组件 scroll
  scrollRenderPop() {
    return (
      <div>
        {this.props.visible&&<div className="m-popLayer">
          <div className="w-main">
            <div className="w-content">
              <div className="w-h1 tac clamp1">不会的就是</div>
              <div className="w-p">
                <div className="p tac">不会的就是感觉说的就</div>
                <div className="p">不会的就是感觉说的就是不断加快胡说八道就开始不觉得困撒不健康的</div>
                <div className="p">不会的就是感觉说的就是不断加快胡说八道就开始不觉得困撒不健康的</div>
                <div className="p">不会的就是感觉说的就是不断加快胡说八道就开始不觉得困撒不健康的</div>
                <div className="p">不会的就是感觉说的就是不断加快胡说八道就开始不觉得困撒不健康的</div>
                <div className="p">不会的就是感觉说的就是不断加快胡说八道就开始不觉得困撒不健康的</div>
              </div>
            </div>
            <div className="w-btn">
              <div className="btn l on">按钮1</div>
              <div className="btn r">按钮2</div>
            </div>
          </div>
        </div>}
      </div>
    );
  }

  // 渲染组件 pic
  picRenderPop() {
    return (
      <div>
        {this.props.visible&&<div className="m-popLayer">
          <div className="w-main pic">
            <div className="w-content" onClick={this.handleClickPic}>
              <img style={{width:'30px', height:'30px'}} src={this.props.picSrc} alt=""/>
            </div>
            <div className="w-btn">
              <div className="btn-close" onClick={this.handleCancel}>
                <img src="https://pic2.58cdn.com.cn/images/xq_img/n_v23e9a7e4da82646bcbdaa64570a590fc1.png" alt=""/>
              </div>
            </div>
          </div>
        </div>}
      </div>
    );
  }

  render() {
    const { type } = this.props;
    console.log(this.props);
    switch (type) {
      case 'center':
        return <div className="absolute-location">{this.centerRenderPop()}</div>
      case 'left':
          return <>{this.leftRenderPop()}</>
      case 'pic':
          return <>{this.picRenderPop()}</>
      default:
        return <><div></div></>
    }
    return;
  }
}

export default Pop
