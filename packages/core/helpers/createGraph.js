const t = require('@babel/types')
const traverse = require('@babel/traverse').default
// const gen = require('@babel/generator').default

const resolves = {
  '.jsx': 'react',
  '.js': 'js',
  '.scss': 'css',
  '.sass': 'css',
}

module.exports = function createGraph({
  compileType,
  entryPath,
  exportPath,
  entry,
}) {
  const graph = _analysisEntry(entryPath, exportPath, this.astUtils.code2ast)

  this.log(`createGraph ${compileType}`)
  
  return graph
}

function _analysisEntry(entryPath, exportPath, code2ast) {
  const fs = require('fs')
  const graph = {}
  function _findGraph(entryPath, info) {
    const code = fs.readFileSync(entryPath, 'utf8')
    const {
      fileType,
      importSource = '',
      exportPath,
    } = info

    graph[entryPath] = {
      code,
      fileType,
      exportPath,
      importSource,
    }
    if (fileType === 'react') {
      const ast = graph[entryPath].ast = code2ast(code)
      // 逐个文件查找，便于定位错误
      const newGraph = {}
      traverse(ast, {
        ImportDeclaration(path) {
          if (path.get('source').isStringLiteral()) {
            const importSource = path.get('source').node.value
            if (!isNpm(importSource)) {
              const {
                entirePath: importFile,
                type: fileType,
                suffix,
              } = resolveFile(entryPath, importSource)
              
              newGraph[importFile] = {
                fileType,
                importSource: importSource.includes(suffix) ?
                    importSource : importSource + suffix,
              }
            }
          }
        }
      })
      Object.entries(newGraph).forEach(([filePath, info]) => {
        if (!graph[filePath]) {
          _findGraph(filePath, info)
        }
      })
    }
  }
  _findGraph(entryPath, {
    fileType: 'react',
    exportPath,
  })
  return graph
}

function resolveFile(entryPath, importSource) {
  const path = require('path')
  
  const importAbsolutePath = path.resolve(path.dirname(entryPath), importSource)
  const file = isFile(importAbsolutePath, resolves)
  if (!file) {
    const msg = `不存在该文件: ${importAbsolutePath}`
    throw Error(msg)
  }
  return file
}

function isNpm(importSource) {
  return /^[a-zA-Z]/.test(importSource)
}

function isFile(filePath, resolves) {
  // 已含有后缀
  if (/\.\w+$/.test(filePath)) {
    const lastPointIndex = filePath.lastIndexOf('.')
    const suffix = filePath.slice(lastPointIndex)
    resolves = {
      [suffix]: resolves[suffix]
    }
    filePath = filePath.slice(0, lastPointIndex)
  }
  // 非resolves内类型暂不考虑
  for (let suffix of Object.keys(resolves)) {
    try {
      const type = resolves[suffix]
      const entirePath = filePath + suffix
      require('fs').statSync(entirePath)
      return {
        entirePath,
        type,
        suffix,
      }
    } catch (error) {
      return false
    }
  }
}