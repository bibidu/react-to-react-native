# React2RN文档

## 🌈 简介

**react2RN** 是一套将React代码转换为React Native代码的解决方案。相较于**Taro**的转换方案，此方案可通过配置标记来实现将`原本存在`的React代码转换为`可二次开发`的React Native代码。

目前，使用 **react2RN**，通过对原有的React组件库添加少许标记，即可得到React Native的组件库。


[点击试用](https://r2rn.bib1du.com/)


## 🌱 转换案例

- React（ 转义前 · React ）

  ![](https://r2rn.bib1du.com/imgs/ReactIMG.png)


- React Native （ 转义后 · React Native ）

  ![](https://r2rn.bib1du.com/imgs/RNIMG.png)

## 🐶 对比Taro
| | Taro |  react2RN
:-:|:-:|:-:
改造成本 | 高 | 低 |
已转换的业务组件个数 | 无法转换 | 8个(持续增加) |
转换组件类型 | —— | 6 |
支持的CSS语法 | 只支持class选择器 | 几乎所有选择器（除伪元素） |


## ⭐ 核心问题

- 动态css语法 -> stylesheet静态css语法
- React与React Native标签、事件的替换规则
- React Native只支持flex布局，如何渲染React中非flex布局
- 转义如何不破坏代码结构，支持二次开发

## ✌️支持写法

### 支持的html标签
- div
- span
- h1 - h6
- p
- button
- textarea
- image
- Fragment/React.Fragment
- i

### 支持继承的属性名
- line-height
- color
- font-size
- text-align
- font-weight

### 支持的事件
- onClick
- onChange

### 支持的scss写法
- 变量声明

  ```scss
  $BASE_COLOR: red;
  .foo {
    color: $BASE_COLOR;
  }
  ```
- 样式嵌套

  ```scss
  .foo {
    color: red;
    &:after{
      content: '!';
    }
    .bar { /* ... */ }
  }
  ```
- 引入其他scss文件

  ```scss
  @import '../../libs/assets/rem.scss';
  ```

### React引入
- `import React from 'react'`

- `import * as React from 'react'`

- `import React, { Component } from 'react'`

### 自定义组件引入
- `import Foo from './foo'`

- `import Foo from './foo.js'`

- `import Foo from './foo.jsx'`

### css样式引入
- `import './foo.css'`

- `import './foo.scss`

### 其他资源引入

  ```jsx
  import wxImg from './imgs/wx.png' // 图片资源
  
  import * as utils from './utils' // 工具库引入
  ```

### 入口组件暴露
```jsx
class App extends React.Component {
  render() {
    return <div>...</div>
  }
}
export default App
```

```jsx
const App = () => (
  <div>...</div>
)
export default App
```

```jsx
const App = function() {
  return <div>...</div>
}
export default App
```

### 自定义组件引入

- 外部JSX组件

  ```jsx
  import Foo from './foo'

  const App = function() {
    return <>
      <Foo color={this.state.color} />
    </>
  }
  ```

- Class组件

  ```jsx
  class Foo extends React.Component {
    render() {
      return <>...</>
    }
  }

  const App = function() {
    return <>
      <Foo color={this.state.color} />
    </>
  }
  ```

- 纯函数组件

  ```jsx
  const Foo = () => <>...</>

  const App = function() {
    return <>
      <Foo color={this.state.color} />
    </>
  }
  ```

### 自定义组件嵌套

- 引入外部组件

  ```jsx
  import Foo from './foo'

  class App extends React.Component {
    render() {
      return <>
        <Foo className="foo" id="foo">{/* ... */}</Foo>
      </>
    }
  }
  ```

  ```jsx
  import Foo from './foo'

  const App = () => (
    <>
      <Foo className="foo" id="foo">{/* ... */}</Foo>
    </>
  )
  ```

- 引入ClassMethod类型组件

  ```jsx
  class App extends React.Component {

    Foo() {
      return <h1>react2RN</h1>
    }

    render() {
      return <>
        {this.Foo()}
      </>
    }
  }
  ```

- 引入ClassProperty类型组件

  ```jsx
  class App extends React.Component {

    Foo = () => {
      return <h1>react2RN</h1>
    }

    render() {
      return <>
        {this.Foo()}
      </>
    }
  }
  ```

### 导出组件

```jsx
class App extends React.Component {
  render() {
    return <>react2RN</>
  }
}

export default App
```

```jsx
const App = () => <>react2RN</>

export default App
```

### 支持的样式写法

- 外连

  ```css
  // foo.scss
  body {
    .foo {}
  }
  ```

- 内联（纯对象）

  ```jsx
  render() {
    return <div style={\{color: 'red'\}}></div>
  }
  ```

- 标签自带

  ```jsx
  render() {
    return <h1>react-to-react-native</h1>
  }
  ```

  ```jsx
  <!-- 等价于 => -->
  render() {
    return (
      <View>
        <Text style={\{fontSize: 36\}}>react-to-react-native</Text>
      <View>
    )
  }
  ```

- 继承

  ```css
  .red_color{
    color: red;
  }
  ```

  ```jsx
  const App = function() {
    return (
      <div className="red_color">
        <h1>react2RN</h1>
      </div>
    )
  }
  <!-- 等价于 =>  -->
  ```

  ```jsx
  const stylesheet = {
    uniqueId1: {
      color: 'red',
      fontSize: 36
    }
  }
  ```
  ```jsx
  const App = function() {
    return (
      <View>
        <View>
          <Text style={stylesheet['uniqueId1']}>
            react2RN
          </Text>
        <View>
      <View>
    )
  }
  ```

### 外联样式混写
```css
.white_color{
  color: #fff;
}
```

```jsx
<!-- A -->
const getClassType = (type) => `${type}-btn`

const App = ({ type }) => <h1 className={`white_color ${getClassType(type)}`}>react2RN</h1>
```

```jsx
<!-- B -->
class App extends React.Component{

  getClassType = (type) => `${type}-btn`

  render() {
    const { type } = this.props
    return <h1 className={`white_color ${this.getClassType(type)}`}>react2RN</h1>
  }
}
```

```jsx
<!-- C -->
class App extends React.Component{

  render() {
    const { active } = this.props
    return <h1 className={`btn ${active ? 'active_btn' : ''}`}>react2RN</h1>
  }
}
```

```jsx
<!-- D: classnames node包式的写法 -->
class App extends React.Component{

  render() {
    const { active } = this.props

    // case 1
    return <h1 className={classnames("title1", { 'title2': a === b })}>react2RN</h1>
    
    // case 2
    return <h1 className={xx.classnames("title1", { 'title2': a === b })}>react2RN</h1>
  }
}
```

### 事件(所有形式)

- 成员变量形式

  ```jsx
  <textarea onChange={this.inputEvent} />
  ```

  ```jsx
  <textarea onChange={inputEvent} />
  ```

- 函数形式

  ```jsx
  <textarea onChange={function inputEvent() {}} />
  ```

  ```jsx
  <textarea onChange={function() {}} />
  ```

- 闭包形式

  ```jsx
    <textarea onChange={e => this.inputEvent(e)} />
    <textarea onChange={e => this.inputEvent(e)([{ z: e }, e])} />
    <textarea onChange={e => this.changeInput(e, { t: e })} />
    <textarea onChange={e => (t) => e + t} />
  ```

### 图片资源

- 字符串类型

  ```jsx
  render() {
    return <img src="https://58cdn.com/react2rn.png" alt="react2rn" />
  }
  ```

- JSX类型

  ```jsx
  render() {
    return <>
      {
        [
          { url: "https://58cdn.com/react2rn.png" }
        ].map(item => (
          <img src={item.url} key={item} alt="react2rn" />
        ))
      }
    </>
  }
  ```

- 引入图片路径

  ```jsx
  import wxImg from './imgs/wx.png' // ES引入

  const wxImg = require('./imgs/wx.png') // commonJs引入
  ```

### background: url的支持

- i标签的静态background-url

  ```scss
  .tz-toast-icon-base{
    background: url('./static/img/tz-toast-success.png') center no-repeat;
  }
  ```

  ```jsx
  render() {
    return <i className={classNames("tz-toast-icon-base", iconClass)}></i>
  }
  ```

  ```jsx
  <!-- 编译后: -->
  render() {
    return <Image source={_util.imgPolyfill(
      require('./static/img/tz-toast-success.png')
    )}></Image>
  }
  ```

## ⚠️ 注意项

### ⚠️ 动态样式的标记
- 对于运行时动态计算的类名，需要进行标记(在css中的动态类名下添加"stable: xxx" 标记)

  ```scss
  .primary-btn{
    /* stable: primary-btn */
    background: blue; 
  }
  .danger-btn{
    /* stable: danger-btn */
    background: red;
  }
  ```

  ```jsx
  activeClass = (type) => `${type}-btn`

  render() {
    const { type } = this.props
    return <button className={`btn ${this.activeClass(type)}`}>react2RN</button>
  }
  ```

### ⚠️ 动态文本的标记
- 对于运行时动态节点的渲染结果为文本时，需要进行标记(在该节点父级添加"rn-text" 标记)

  ```jsx
  import React from 'react'

  class App extends React.Component {

    bar = (value) => <div rn-text>{value}</div>

    render() {
      return <div>{this.bar(123)}</div>
    }

  }

  export default App

  ```

### ⚠️ 样式的优先级
- 动态样式和静态样式同时存在时，优先级以动态样式为主。

  ```css
  .a{
    color: red;
  }
  .b{
    color: green;
  }
  .active{
    color: blue;
  }
  ```

  ```jsx
  import React from 'react'
  import './index.scss'

  const getActiveStyle = () => `active`
  
  const App = function() {
    return <div className="container">
      <div className={`a ${getActiveStyle()} b`}>123</div>
    </div>
  }

  export default App
  ```

  ```jsx
  <!-- 最终的颜色是green，因为react2rn会将顺序调整为 -->
  <View>
    <Text style={[
      Object.assign(
        {},
        stylesheet['a'],
        stylesheet['b'],
        stylesheet[getActiveStyle()]
      )
    ]}>
      123
    </Text>
  </View>
  ```

### ⚠️ 样式的绝对定位
- 绝对定位的元素的父级要求也必须是绝对定位，且具有合适的top、left等属性。

### ⚠️ 动态样式（如类名）的书写方式

```jsx
  <!-- 不要通过显式的判断区分类似的active动态类名 -->
  render() {
    return <div>
      {
        this.state.list.map((item, index) => {
          const localNameWithDef = item => (item.localName || this.state.defaultValue)

          if (item.level === this.state.currentLevel) {
            return (
              <li className="tz-area-tab-li active" key={index}>
                <span>{localNameWithDef(item)}</span>
              </li>
            )
          } else {
            return (
              <li className="tz-area-tab-li" key={index}>
                <span>{item.localName}</span>
              </li>
            )
          }
        })
      }
    </div>
  }
```

```jsx
  <!-- 改写1: 通过封装类名方法 -->
  render() {
    return <div>
      {
        this.state.list.map((item, index) => {
          const localNameWithDef = item => (item.localName || this.state.defaultValue)
          const isActiveItem = (item) => item.level === this.state.currentLevel
          const getActiveClass = (item) => isActiveItem(item) ? 'active' : ''

          return (
            <li className={`tz-area-tab-li ${getActiveClass(item)}`} key={index}>
              <span>
                {
                  isActiveItem(item) ? localNameWithDef(item) : item.localName
                }
              </span>
            </li>
          )
        })
      }
    </div>
  }
```

```jsx
  <!-- 改写2: 通过三目表达式 -->
  render() {
    return <div>
      {
        this.state.list.map((item, index) => {
          const localNameWithDef = item => (item.localName || this.state.defaultValue)

          return (
            <li className={`tz-area-tab-li
              ${item.level === this.state.currentLevel ? 'active' : ''}
            `} key={index}>
              <span>
                {
                  item.level === this.state.currentLevel ?
                    localNameWithDef(item) : item.localName
                }
              </span>
            </li>
          )
        })
      }
    </div>
  }
```

### ⚠️ 伪元素

- 不支持css伪元素的书写方式，推荐改用js方式实现

  ```css
  .item{
    margin-right: 10px;
    &:after{
      margin-right: 0;
    }
  }
  ```

  ```jsx
  render() {
    return <div>
      {
        this.state.list.map((item, index) => (
          <div className="item" key={index}>
            {item}
          </div>
        ))
      }
    </div>
  }
  ```

  ```css
  <!-- 改写为 -->
  .item{
    margin-right: 10px;
    .item-after{
      margin-right: 0;
    }
  }
  ```

  ```jsx
  <!-- 改写为 -->
  render() {
    return <div>
      {
        this.state.list.map((item, index) => {
          const isLastChild = index === this.state.list.length - 1
          return (
            <div className=`item ${isLastChild ? 'item-after' : ''}` key={index}>
              {item}
            </div>
          )
        })
      }
    </div>
  }
  ```
