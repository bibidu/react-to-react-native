// 地区选择器
import React, { Component } from 'react';
import './style.scss';
import { province as provinceList } from './config/provinceData';

const classNamePrefix = 'tz-area-';
const MAX_LEVEL = 3;
const DefaultResult = [
  {localId: '', localName: '', level: 0},
  {localId: '', localName: '', level: 1},
  {localId: '', localName: '', level: 2},
  {localId: '', localName: '', level: 3},
];
const DefaultUnit = ['省', '市', '区/县', '乡/镇'];

class AreaSelector extends Component {
  constructor (props) {
    super(props);
    this.state = {
      // 当前显示的选项列表：初始为省
      optionsList: this.props.initialList || provinceList,
      // 当前显示的选项level, 枚举[0,1,2,3]
      currentLevel: 0,
      // 当前显示的Tab列表||已选的值
      result: this.initResult(this.props.result),
    };
    // 下级数据的缓存
    this.cache = {};
  }

  setCache = (localId, result) => {
    this.cache[localId] = result;
  }

  getCache = (localId) => this.cache[localId]

  // 点击Tab
  onClickTab = (item, index) => {
    // 上一级未选
    if (index != 0 && this.state.result[index - 1].localName == '') {
      this.tip('请选择上一级')

      return;
    }

    // 当前Tab
    if (index == this.state.currentLevel) {
      return;
    }

    if (index == 0) { // 切换省
      this.setState({
        optionsList: provinceList,
        currentLevel: index
      })
    } else { // 切换其他级别
      const previousTab = this.state.result[index - 1];
      const targetLevel = item.level;
      let newOptionsList = this.getCache(previousTab.localId);

      if (typeof newOptionsList != 'undefined') { // 如果有缓存
        this.setState({
          currentLevel: targetLevel,
          optionsList: newOptionsList
        })
      } else {
        this.props.onAcquireNext(previousTab).then((res) => {
          this.setCache(previousTab.localId, res);
          this.setState({
            currentLevel: targetLevel,
            optionsList: res
          })
        })
      }
    }
  }

  // 初始化已选地区数组
  initResult = (list) => {
    if (!list || list.length < 1 || list.length > 4) {
      return DefaultResult;
    } else {
      for (let i = 0; i < MAX_LEVEL + 1; i++) {
        if (typeof list[i] === 'undefined' || !list[i].localId) {
          list[i] = {localId: '', localName: '', level: i}
        }
      }

      return list;
    }
  }

  // 点击选项
  onClickOption = ({ item }) => {
    // 判断是否是最后一级，自动视为选择完毕，相当于点击“确定”
    if (item.level === MAX_LEVEL) {
      let result = this.state.result.concat();

      result[MAX_LEVEL] = item;
      this.props.onSelect(result);
    } else {
      this.getNewOptionList(item).then((newOptionsList) => {
        this.setState({
          currentLevel: item.level + 1,
          result: this.getNewTab(item),
          optionsList: newOptionsList
        });
      })
    }
  }

  getNewTab = (target) => {
    if (this.state.result[target.level].localId != target.localId) { // 判断当前级别是否不同
      let newTab = Array(4).fill({});

      for (let i = 0; i < MAX_LEVEL + 1; i++) {
        if (i < target.level) {
          newTab[i] = this.state.result[i];
        } else if (i == target.level) {
          newTab[i] = target;
        } else {
          newTab[i] = {localId: '', localName: '', level: i};
        }
      }

      return newTab;
    } else {
      return this.state.result;
    }
  }

  getNewOptionList = (target) => new Promise((resolve, reject) => {
    const cache = this.getCache(target.localId);
    if (typeof cache !== 'undefined') {
      resolve(cache);
    } else {
      this.props.onAcquireNext(target).then((res) => {
        // 第三级，”市辖区“是有可能没有下级数据的
        if (res.length == 0 && target.level != 2) {
          this.tip('获取下一级数据为空');
          reject();
        } else {
          this.setCache(target.localId, res);
          resolve(res);
        }
      }, () => {
        this.tip('获取下一级数据失败');
        reject();
      })
    }
  })

  // 确认
  onClickConfirm = () => {
    const limit = this.props.limitLevel || 3;
    const { result } = this.state;

    if (result[limit - 1].localId == -1 || result[limit - 1].localId == '') {
      this.tip(`请至少选择${DefaultUnit[limit - 1]}`)
    } else {
      let item = result[limit];

      if (item.localId == -1) {
        item = result[limit - 1];
      }

      this.props.onSelect(result);
    }
  }

  tip = (msg) => {
    if (typeof this.props.onTip === 'function') {
      this.props.onTip(msg);
    } else {
      window.alert(msg);
    }
  }

  // 渲染顶部Tab
  renderTab () {
    return (
      <div className="tz-area-tab">
        <ul className="tz-area-tab-list">
          {
            this.state.result.map((item, index) => {
              if (item.level === this.state.currentLevel) {
                return (
                  <li className="tz-area-tab-li  active" key={index}
                    onClick={() => {this.onClickTab(item, index)}}>
                    <span>
                      {item.localName || DefaultUnit[this.state.currentLevel]}
                    </span>
                  </li>
                )
              } else {
                return (
                  <li className="tz-area-tab-li" key={index}
                    onClick={() => {this.onClickTab(item, index)}}>
                    <span>{item.localName}</span>
                  </li>
                )
              }
            })
          }
        </ul>
      </div>
    );
  }

  // 渲染选项
  renderOptions () {
    return (
      <div className="tz-area-options">
        <ul className="tz-area-options-list">
          {
            this.state.optionsList.map((item, index) => {
              let className = '';
              const isActive = item.localId == this.state.result[this.state.currentLevel].localId;

              if (isActive) {
                className = 'active';
              }

              return (
                <li className={React.classnames(['tz-area-options-item', className])} key={index} onClick={() => {
                  this.onClickOption({ item, isActive });
                }}>
                  <div className="options-wrapper">
                    <span className="tz-area-options-text">{item.localName}</span>
                  </div>
                </li>
              );
            })
          }
        </ul>
      </div>
    );
  }

  render () {
    return (
      <div className="tz-area-wrapper">
        <div className="tz-area-mask" onClick={this.props.onCancel} />
        <div className="tz-area-content">
          <div className="tz-area-title">
            <div className="tz-area-button-cancel" onClick={this.props.onCancel}>取消</div>
            <div>
              <span>{this.props.title || '选择位置'}</span>
            </div>
            <div className="tz-area-button-confirm" onClick={this.onClickConfirm}>确定</div>
          </div>
          {this.renderTab()}
          {this.renderOptions()}
        </div>
      </div>
    );
  }
}

class A extends React.Component {
  onAcquireNext = (localId) => {
    return Promise.resolve([
      { localId: 1111, localName: 'ddd' }
    ])
  }
  render() {
    return <AreaSelector
      onAcquireNext={this.onAcquireNext}
    />
  }
}
export default A