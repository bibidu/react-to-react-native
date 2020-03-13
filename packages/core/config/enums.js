module.exports = {
  UNIQUE_ID: 'UI', // dom元素的唯一属性前缀
  HTML_UNIQUE_ID_ATTRNAME: 'unique_id', // 生成pureHTML中的uniqueId属性名
  STYLESHEET_NAME: 'styles', // 生成stylesheet的name
  STYLESHEET_FILE_NAME: 'stylesheet', // 生成stylesheet文件名
  STATIC_MARK: 'rn-text', // 子元素是静态文本的标记
  ACTIVE_ADD_TEXT_MARK: '__active', // 动态添加的文本标签属性名
  SINGLE_FILE: 'single_file', // 编译类型为单文件
  MULTIPLE_FILE: 'multiple_file', // 编译类型为多文件
  ACTIVE_CLASSNAME_WILL_REPLACEBY_STYLESHEET: 'activeClassName$$', // 最终替换成stylesheet.xxx的动态类名
  RNUTILS_USE_NAME: '_util', // 最终生成的rnUtils调用名
  OMIT_CAN_INHERIT_STYLE_NAME_FUNC: 'omit', // 最终生成的rnUtils中的omitInheritStyleName函数
  EXTRACT_CAN_INHERIT_STYLE_NAME_FUNC: 'extend', // 最终生成的rnUtils中的extractInheritStyleName函数
  IMG_POLYFILL_FUNC: 'imgPolyfill', // 最终生成的rnUtils中的imgPolyfill函数
  EVENT_TARGET_FUNC: 'eventPolyfill', // 最终生成的rnUtils中的eventTarget函数
  CAN_INHERIT_STYLE_NAMES: 'canInheritStyleName', // 最终生成的rnUtils中‘可继承的文本css属性名’
  RNUTILS_FILE_NAME: 'tools',
}