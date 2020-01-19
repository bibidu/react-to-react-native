const t = require('@babel/types')
const traverse = require('@babel/traverse').default
// const gen = require('@babel/generator').default

const resolves = ['.jsx', '.js']

module.exports = function createGraph({
  compileType,
  entryPath,
  entry,
}) {
  // const ast = this.astUtils.code2ast(entry)
  const graph = _analysisEntry(entryPath, this.astUtils.code2ast)

  this.log(`createGraph ${compileType}`)
  
  return graph
}

function _analysisEntry(entryPath, code2ast) {
  const fs = require('fs')
  const graph = {}
  function _findGraph(entryPath) {
    const code = fs.readFileSync(entryPath, 'utf8')
    const ast = code2ast(code)
    graph[entryPath] = code

    // 逐个文件查找，便于定位错误
    const newGraph = {}
    traverse(ast, {
      ImportDeclaration(path) {
        if (path.get('source').isStringLiteral()) {
          const importSource = path.get('source').node.value
          if (!isNpm(importSource)) {
            const importFile = resolveFile(entryPath, importSource)
            newGraph[importFile] = fs.readFileSync(importFile, 'utf8')
          }
        }
      }
    })
    Object.entries(newGraph).forEach(([filePath, code]) => {
      if (!graph[filePath]) {
        _findGraph(filePath, graph)
      }
    })
  }
  _findGraph(entryPath)

  return graph
}

function resolveFile(entryPath, importSource) {
  const path = require('path')
  
  const importAbsolutePathWithoutFileType = path.resolve(path.dirname(entryPath), importSource)
  const file = isFile(importAbsolutePathWithoutFileType, resolves)
  if (!file) {
    const msg = `不存在该文件: ${importAbsolutePathWithoutFileType}`
    throw Error(msg)
  }
  return file
}

function isNpm(importSource) {
  return /^[a-zA-Z]/.test(importSource)
}

function isFile(filePath, resolves) {
  for (let item of resolves) {
    try {
      const entirePath = filePath + item
      require('fs').statSync(entirePath)
      return entirePath
    } catch (error) {
      return false
    }
  }
}