# React2RN文档

## 🌈 简介

**react2RN** 是一套将React代码转换为React Native代码的解决方案。相较于**Taro**的转换方案，此方案可通过配置标记来实现将`原本存在`的React代码转换为`可二次开发`的React Native代码。

目前，使用 **react2RN**，通过对原有的React组件库添加少许标记，即可得到React Native的组件库。


[点击试用](http://39.107.227.103:3000/)


## 🌱 转换案例

- React（ 转义前 · React ）

  ![](imgs/ReactIMG.png)


- React Native （ 转义后 · React Native ）

  ![](imgs/RNIMG.png)

## 🐶 对比Taro
| | Taro |  react2RN
:-:|:-:|:-:
改造成本 | 高 | 低 |
已转换的业务组件个数 | 无法转换 | 8个(持续增加) |
转换组件类型 | —— | 6 |
支持的CSS语法 | 只支持class选择器 | 所有选择器 |


## ⭐ 核心问题

- 动态css语法 -> stylesheet静态css语法
- React与React Native标签、事件的替换规则
- React Native只支持flex布局，如何渲染React中非flex布局
- 转义如何不破坏代码结构，支持二次开发

## ✌️支持写法

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

### 引入其他组件
```jsx
import Foo from './foo'

const App = function() {
  return <>
    <h1>title</h1>
    <Foo color={this.state.color} />
  </>
}
```

### 自定义组件嵌套
```jsx
import Foo from './foo'

class App extends React.Component {
  render() {
    return <>
      <h1>title</h1>
      <Foo className="foo" id="foo">
        <div>
          {
            // xxx
          }
        </div>
      </Foo>
    </>
  }
}
```

### 支持的样式写法

- 外连
```scss
// foo.scss
body {
  .foo {
    /* ... */
  }
}
```

- 内联（纯对象）
```jsx
<div style={{color: 'red'}}></div>
```

- 标签自带
```html
<h1>react-to-react-native</h1>

<!-- 等价于 => -->

<View>
  <Text style={{fontSize: 36}}>react-to-react-native</Text>
<View>
```

- 继承
```scss
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

const stylesheet = {
  uniqueId1: {
    color: 'red',
    fontSize: 36
  }
}

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

### 支持的html标签
- div
- span
- h1 - h6
- p
- button
- textarea
- image

### 支持的事件
- onClick

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
