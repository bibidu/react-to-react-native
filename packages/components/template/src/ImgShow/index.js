import React from 'react'
import './index.scss'
import tzIMG from './imgs/tz.png'

class ImgShow extends React.PureComponent {

  state = {
    shape: -1 // 0:横，1:竖
  };

  loadImg = (url) => new Promise((resolve, reject) => {
    let img = new Image();
    img.src = url;
    img.onload = () => {
      resolve({ width: img.width, height: img.height })
    }
  })

  urlAddParam = (url, width, height) => {

    if (!url) {
      return url
    }

    return `${url.split('?')[0]}?w=${width}&h=${height}&crop=1`;
  }

  showImg = (arr) => {

    return (
      <div className="imgbox">
        <div className="imgcontainer">
          <>
            {
              arr.map((item, index) => (
                <div key={index} className="img-row">
                  {
                    item.map((_item, _index) => (
                      <div key={_index} className="imgitem">
                        <div className="imgitembox">
                          <img src={_item} onClick={() => this.tapImgHandle(index)} />
                        </div>
                      </div>
                    ))
                  }
                </div>
              ))
            }
          </>
        </div>
      </div>
    )
  }

  noopFun = () => true

  tapImgHandle = (index) => {
    const { beforePreviewFun = this.noopFun, imgArr = [], tapImg } = this.props;
    tapImg && tapImg()
    beforePreviewFun();

    alert(`第${index || 0}张图片`)
  }

  premakeImgArr = (arr) => {
    let lastCount = arr.length
    let index = 0
    const results = []
    while (lastCount > 0) {
      const count = lastCount >= 3 ? 3 : lastCount
      results.push(
        Array(count).fill().map(() => arr[index++])
      )
      lastCount = lastCount - count
    }
    console.log(results)
    return results
  }

  render() {
    const { imgArr = [] } = this.props
    const serilizedImgArr = this.premakeImgArr(imgArr)
    // return this.showImg(serilizedImgArr)
    return (
      <div className="imgbox">
        <div className="imgcontainer">
          <>
            {
              serilizedImgArr.map((item, index) => (
                <div key={index} className="img-row">
                  {
                    item.map((_item, _index) => (
                      <div key={_index} className="imgitem">
                        <div className="imgitembox" onClick={() => this.tapImgHandle(index * 3 + _index + 1)} >
                          <img src={_item}/>
                        </div>
                      </div>
                    ))
                  }
                </div>
              ))
            }
          </>
        </div>
      </div>
    )
  }
}

class I extends React.Component {
  render() {
    return <div className="test-container">
      <ImgShow
        imgArr={
          [
            tzIMG,
            tzIMG,
            tzIMG,
            tzIMG,
            tzIMG,
            tzIMG,
            tzIMG,
            tzIMG,
            tzIMG
          ]
        }
      >
      
      </ImgShow>
    </div>
  }
}
export default I
