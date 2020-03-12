import React from 'react';
import './Share.scss';
import wxImg from './imgs/wx.png'
import pyqImg from './imgs/pyq.png'
import qqImg from './imgs/qq.png'
import qqzoneImg from './imgs/qqzone.png'

// 分享类型
const ShareType = {
  'WEICHAT': 0,
  'TIMELINE': 1,
  'QQ': 2,
  'QZONE': 3
}

const list=[{
  title: '微信',
  imgUrl: wxImg,
},{
  title: '朋友圈',
  imgUrl: pyqImg,
}, {
  title: 'QQ',
  imgUrl: qqImg,
},{
  title: 'QQ空间',
  imgUrl: qqzoneImg,
}
];



class Share extends React.PureComponent {

  static ShareType = ShareType

  constructor(props) {
    super(props);
  }

  renderItem = (item, index) => {
    return (
      <li key={index} className="list-item" onClick={()=>{this.props.onShare(index)}}>
        <div className="list-item-img">
          <img className="list-item-img-inner" src={item.imgUrl} />
        </div>
        <span className="list-item-title">{item.title}</span>
      </li>
    )
  }

  render() {
    const {
      onShare,
      onCancel,
    } = this.props;
    return (
      <div className="container">
        <div className="layer" onClick={onCancel}></div>
        <div className="content">
          <div className="body">
            <div className="title">分享到</div>
            <ul className="list-container">
              {
                list.map((item, index) => {
                  return this.renderItem(item, index);
                })
              }
            </ul>
          </div>
          <div className="cancle" onClick={onCancel}>取消</div>
        </div>
      </div>
    )
  }
}


class S extends React.Component{
  render() {
    return <Share
      onShare={(x) => alert('onShare'+x)}
      onCancel={() => alert('onCancel')}
    />
  }
}
export default S

