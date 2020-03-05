# React2RN文档

## 🌈 简介

**react2RN** 是一套将React代码转换为React Native代码的解决方案。相较于**Taro**的转换方案，此方案可通过配置标记来实现将`原本存在`的React代码转换为`可二次开发`的React Native代码。

目前，使用 **react2RN**，通过对原有的React组件库添加少许标记，即可得到React Native的组件库。


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

