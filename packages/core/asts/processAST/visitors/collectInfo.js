module.exports = function collectInfo({ ctx, t }) {
  return {
    ExportDefaultDeclaration(path) {
      const { name } = path.get('declaration').node
      // 收集导出的组件名
      ctx.collections.exports.push(name)
    }
  }
}
