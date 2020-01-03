module.exports = function addUniqueId({ ctx, t }) {
  return {
    ExportDefaultDeclaration(path) {
      const { name } = path.get('declaration').node
      ctx.collections.exports.push(name)
    }
  }
}
