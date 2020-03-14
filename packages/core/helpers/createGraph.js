const t = require('@babel/types')
const traverse = require('@babel/traverse').default
// const gen = require('@babel/generator').default

let ctx

module.exports = async function createGraph({
  compileType,
  cssType,
  entryPath,
  exportPath,
  reactCompString,
  cssString,
}) {
  ctx = this

  const graph = await _analysisEntry(
    cssType,
    entryPath,
    exportPath,
    reactCompString,
    cssString,
    this.astUtils.code2ast,
  )

  this.log(`createGraph ${compileType}`)
  
  return graph
}

async function _analysisEntry(
  cssType,
  entryPath,
  exportPath,
  reactCompString,
  cssString,
  code2ast,
) {
  // TODO: add 添加process.env.COMPILE_ENV环境判断，用于隔离node环境和浏览器环境
  const fs = require('fs')
  const graph = {}

  async function _findGraph(entryPath, info) {
    let code = fs.readFileSync(entryPath, 'utf8')
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
      if (['.ts', '.tsx'].some(prefix => entryPath.endsWith(prefix))) {
        code = await ctx.typescriptCompiler(code)
      }
      const ast = graph[entryPath].ast = code2ast(code)
      // 逐个文件查找，便于定位错误
      const newGraph = {}
      traverse(ast, {
        ImportDeclaration(path) {
          if (path.get('source').isStringLiteral()) {
            const importSource = path.get('source').node.value
            if (!isNpm(importSource)) {
              const {
                entirePath,
                type,
                suffix,
              } = resolveFile(entryPath, importSource)

              newGraph[entirePath] = {
                fileType: type,
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
  if (!process.env.COMPILE_ENV || process.env.COMPILE_ENV === 'node') {
    await _findGraph(entryPath, {
      fileType: 'react',
      exportPath,
    })
  } else {
    graph['react'] = {
      code: reactCompString,
      ast: code2ast(reactCompString),
      fileType: 'react',
      exportPath: null,
      importSource: null,
    }
    
    graph['css'] = {
      code: cssString,
      fileType: cssType,
      exportPath: null,
      importSource: null,
    }
  }
  
  return graph
}

function resolveFile(entryPath, importSource) {
  const path = require('path')

  const importAbsolutePath = path.resolve(path.dirname(entryPath), importSource)
  const file = ctx.isFile(importAbsolutePath)
  if (!file) {
    const msg = `不存在该文件: ${importAbsolutePath}`
    throw Error(msg)
  }
  return file
}

function isNpm(importSource) {
  return /^[a-zA-Z]/.test(importSource)
}

