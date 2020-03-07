module.exports = {
  UNIQUE_ID: 'unique_id', // dom元素的唯一属性前缀
  HTML_UNIQUE_ID_ATTRNAME: 'unique_id', // 生成pureHTML中的uniqueId属性名
  STYLESHEET_NAME: 'stylesheet', // 生成stylesheet的name
  STYLESHEET_FILE_NAME: 'stylesheet', // 生成stylesheet文件名
  STATIC_MARK: 'rn-text', // 子元素是静态文本的标记
  ACTIVE_ADD_TEXT_MARK: '__active', // 动态添加的文本标签属性名
  SINGLE_FILE: 'single_file', // 编译类型为单文件
  MULTIPLE_FILE: 'multiple_file', // 编译类型为多文件
  ACTIVE_CLASSNAME_WILL_REPLACEBY_STYLESHEET: 'activeClassName$$', // 最终替换成stylesheet.xxx的动态类名
}