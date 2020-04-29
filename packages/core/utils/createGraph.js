const fs = require('fs')
const traverse = require('@babel/traverse').default

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
  this.logger.log({ type: 'flow', msg: 'createGraph' })
  
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
  const graph = {}

  async function _findGraph(entryPath, info) {
    let code = fs.readFileSync(entryPath, 'utf8')
    let {
      fileType,
    } = info
    const {
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
      if (isTsFile(entryPath)) {
        code = await ctx.typescriptCompiler(code)
      }
      const ast = graph[entryPath].ast = code2ast(code)
      
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
  
  if (__NODE__) {
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
  const file = ctx.utils.isFile(importAbsolutePath)
  if (!file) {
    const msg = `不存在该文件: ${importAbsolutePath}`
    throw Error(msg)
  }
  return file
}

function isNpm(importSource) {
  return /^[a-zA-Z]/.test(importSource)
}

function isTsFile(filepath) {
  return ['.ts', '.tsx'].some(prefix => filepath.endsWith(prefix))
}
