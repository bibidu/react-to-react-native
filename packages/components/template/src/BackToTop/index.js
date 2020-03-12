// 返回顶部

import React from 'react';
import './back-to-top.scss'
import icon from './static/img/arrow-top.png'

let intervalTime = null;
class BackToTop extends React.Component {

  scrollToTop() {
    alert(JSON.stringify(this.props || {}))
    // const { scrollDefault = false, scrollCount = 15, scrollTime = 10 } = this.props || {};
    // if (scrollDefault) {
    //   document.documentElement.scrollTop = 0;
    //   document.body.scrollTop = 0;
    //   return;
    // }
    // this.intervalTime = setInterval(() => {
    //   let top = document.documentElement.scrollTop || document.body.scrollTop;
    //   const spreed = Math.floor(-top / scrollCount);
    //   document.documentElement.scrollTop = top + spreed;
    //   document.body.scrollTop = top + spreed;
    //   if (top <= 0) {
    //     clearInterval(this.intervalTime);
    //   }
    // }, scrollTime);
  }

  render () {
    const {
      wrapStyle = {},
      txt = '顶部',
      txtStyle = {},
      fnode = null,
    } = this.props || {};

    return (
      <>
        <div className='tz-back-to-top' style={wrapStyle} onClick={(e) => this.scrollToTop(e)}>
          <div className="tz-back-to-top-wrap">
            <img className="tz-back-to-top-icon" src={icon} alt=""/>
            <div className='tz-back-to-top-txt' style={txtStyle}>
              <span>{txt}</span>
            </div>
          </div>
        </div>
      </>
    )
  }
}
class B extends React.Component{
  render() {
    return (
      <div>
        <p>
        更新日志用来记录和分享 SegmentFault 近期的新功能和一些改进，也包括我们的思考和心得，希望部分经验能给你的开发工作中带来一些帮助。
        Features
        1、新版文章详情页上线

        设计和开发共同遵守 Bootstrap 的规范，极大减少了沟通成本和开发成本
        调整了字体大小和间距，提高阅读舒适度
        重新计算了阅读时长，公式为 时长（秒） = 总字数 ÷ 钟平均阅读速度(约 500 字/分) + 图片数 * 5
        精简了大量代码，页面体积减少约 20%，提高文章详情页的载入速度
        提高专栏与文章将的区分度，让专栏有更好的展示
        绑定 GitHub 的用户发布内容时，有单独图标展示了——“Talk is Cheap, Show me the Code”
        2、解决远程图片因防盗链无法显示的问题

        用户发布文章后，我们会以异步方式将远程的图片抓取到 CDN 服务器上
        我们改进远程图片异步抓取的写法，提高抓取性能和速度。
        3、编辑器优化

        改进添加标签时，输入体验的舒适度
        隐藏了编辑器 标题 1 选项，一篇文章中多个 会降低该标签的权重
        编辑器预览区域代码增加高亮功能
        Bug Fixes
        离开撰写页面时频繁出现警告弹窗的问题
        改进输入框聚焦效果（颜色没那么刺眼了）
        iOS 端部分用户无法查看已购课程的问题
        特别感谢远程的图片抓取到 CDN 服务器上
        我们改进远程图片异步抓取的写法，提高抓取性能和速度。
        3、编辑器优化

        改进添加标签时，输入体验的舒适度
        隐藏了编辑器 标题 1 选项，一篇文章中多个 会降低该标签的权重
        编辑器预览区域代码增加高亮功能
        Bug Fixes
        离开撰写页面时频繁出现警告弹窗的问题
        改进输入框聚焦效果（颜色没那么刺眼了）
        iOS 端部分用户无法查看已购课程的问题
        特别感谢远程的图片抓取到 CDN 服务器上
        我们改进远程图片异步抓取的写法，提高抓取性能和速度。
        3、编辑器优化

        改进添加标签时，输入体验的舒适度
        隐藏了编辑器 标题 1 选项，一篇文章中多个 会降低该标签的权重
        编辑器预览区域代码增加高亮功能
        Bug Fixes
        离开撰写页面时频繁出现警告弹窗的问题
        改进输入框聚焦效果（颜色没那么刺眼了）
        iOS 端部分用户无法查看已购课程的问题
        特别感谢
        </p>  
        <BackToTop/>
      </div>
    )
  }
}

export default B