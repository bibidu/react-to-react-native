const t = require('@babel/types')
const traverse = require('@babel/traverse').default

let ctx

/**1. 支持
 * <div>
 *  {this.renderA()}
 * </div>
 * 
 * 2.暂不支持
 * <div>
 *  {renderA()}
 * </div>
 * 
 * 3.暂不支持
 * <div>
 *  {renderA}
 * </div>
 * 
 * 
 * 
 * @param {*} param0 
 */
module.exports = function astToRelationTree(ast, currentPath) {
  ctx = this

  function getQuasisStaticValueInTemplateLiteral(templateLiteralPath){
    const quasis = templateLiteralPath.get('quasis')
    let value = ''
    for (let item of quasis) {
      const current = item.get('value').node.raw
      current && (value += `${current} `)
    }
    return value
  }

  function getQuasisActiveValueInTemplateLiteral(templateLiteralPath) {
    const expressionCodeArr = templateLiteralPath.get('expressions')
    return expressionCodeArr
  }

  function getParentNodeName(path) {
    const parentNode = path.findParent((p) => (
      p.isJSXElement() ||
      p.isClassMethod() || 
      p.isFunctionDeclaration() || 
      p.isClassDeclaration() ||
      p.isVariableDeclarator() ||
      p.isClassProperty()
    ))

    return getCurrentFileUniqueName(parentNode)
  }

  function getCurrentFileUniqueName(path) {
    const { start, end } = path.node
    
    let base = ctx.hashHelper(currentPath) + '-'

    if (path.isJSXElement()) {
      base += getJSXUniqueId(path) + '-' + 'JSXElement-' + path.get('openingElement').get('name').node.name
    } else if (path.isClassMethod()) {
      const classMethodPrefix = getClassMethodPrefix(path)
      base += classMethodPrefix + path.get('key').node.name
    } else if (path.isFunctionDeclaration()) {
      base += 'Function-' + path.get('id').node.name
    } else if (path.isClassDeclaration()) {
      base += 'Class-' + path.get('id').node.name
    } else if (path.isVariableDeclarator()) {
      base += 'VariableDecl-' + path.get('id').node.name 
    } else if (path.isClassProperty()) {
      base += 'ClassProperty-' + path.get('key').node.name
    } else {
      ctx.error('JSXElement父级不合法')
    }

    // const uniqueName = uniquePrefix + base
    const uniqueName = base
    return uniqueName
  }

  function getMatchFnUpward(path, compareName, matchType) {
    if (matchType === 'ClassMethod') {
      const parentContainer = path.findParent((p) => p.isClassDeclaration())
      const classMethods = parentContainer.get('body').get('body')
      for (let clazzMethod of classMethods) {
        if (clazzMethod.get('key').isIdentifier({ name: compareName })) {
          return clazzMethod
        }
      }
    }
  }

  function getJSXUniqueId(path) {
    const attributes = path.get('openingElement').get('attributes')
    for (let attr of attributes) {
      if (attr.get('name').isJSXIdentifier({ name: ctx.enums.UNIQUE_ID })) {
        return attr.get('value').node.value
      }
    }
    throw '未找到JSXElement节点的uniqueId'
  }

  function getClassMethodPrefix(path) {
    const parentClass = path.findParent(p => p.isClassDeclaration())
    const className = parentClass.get('id').node.name
    return `Class-${className}-`
  }

  function extractJSXNodeInfo(JSXElementPath) {
    const openingElement = JSXElementPath.get('openingElement')
    const tagName = ctx.jsxUtils.getTagName(JSXElementPath)

    const result = {
      tagName,
      className: '',
      activeClassName: [],
      id: '',
      activeId: '',
      uniqueId: '',
      activeAddText: ''
    }
    const attributes = openingElement.get('attributes')
    for (let attr of attributes) {
      ;[
        'className',
        'id',
      ].forEach(attrName => {

        if (attr.get('name').isJSXIdentifier({ name: attrName })) {
          const { staticExpression, activeExpression } = getAttrValueExactly(attr.get('value'))
          const activeKey = 'active' + attrName.replace(/^\w/, (_) => _.toUpperCase())
          result[attrName] = staticExpression
          result[activeKey] = activeExpression || []
        }
      })

      if (attr.get('name').isJSXIdentifier({ name: ctx.enums.UNIQUE_ID })) {
        const name = 'uniqueId'
        const { staticExpression } = getAttrValueExactly(attr.get('value'))
        const activeKey = 'active' + name.replace(/^\w/, (_) => _.toUpperCase())
        result[name] = staticExpression
      }

      if (attr.get('name').isJSXIdentifier({ name: ctx.enums.ACTIVE_ADD_TEXT_MARK })) {
        const { staticExpression } = getAttrValueExactly(attr.get('value'))
        result['activeAddText'] = staticExpression
      }
    }
    return result
  }

  function getAttrValueExactly(attrValuePath) {
    let staticExpression = '', activeExpression = ''
    // className="title" or className="title1 title2"
    if (attrValuePath.isStringLiteral()) {
      staticExpression = attrValuePath.node.value.trim()
    }
    if (attrValuePath.isJSXExpressionContainer()) {
      const expression = attrValuePath.get('expression')
      // className={"title"} or className={"title1 title2"}
      if (expression.isStringLiteral()) {
        staticExpression = expression.node.value.trim()
      }
      // className={`title1 ${activeClassName} title2`}
      if (expression.isTemplateLiteral()) {
        staticExpression = getQuasisStaticValueInTemplateLiteral(expression).trim()
        activeExpression = getQuasisActiveValueInTemplateLiteral(expression)
      }
      // className={['title1 title2']}
      if (expression.isArrayExpression()) {
        const validValue = expression.get('elements.0')
        if (validValue.isStringLiteral()) {
          staticExpression = validValue.node.value.trim()
        }
        // className={[`title1 ${other} title2`]}
        if (validValue.isTemplateLiteral()) {
          staticExpression = getQuasisStaticValueInTemplateLiteral(validValue).trim()
          activeExpression = getQuasisActiveValueInTemplateLiteral(validValue)
        }
      }
    }
    return {
      staticExpression,
      activeExpression,
    }
  }

  function getComponentMapName(tagName, currentPath, path) {

    function getImportType() {
      let parent = path.findParent(() => true)
      while (parent) {
        for (let i = 0; i < parent.container.length; i++) {
          const item = parent.container[i]
          if (item.type === 'ImportDeclaration') {
            if (item.specifiers.length) {
              const importPath = item.source.value
              const name = item.specifiers[0].local.name
              if (name === tagName) {
                const file = resolveFile(currentPath, importPath)
                return `${ctx.hashHelper(file.entirePath)}-Class-${tagName}`
              }
            }
          }
        }
        parent = parent.findParent(() => true)
      }
    }

    // TODO: update 逐级向上查找，而非指定最外层class。while循环直到找到Program为止即可。
    function getClassType() {
      const parent = path.findParent((node) => node.isProgram())
      const classes = parent.get('body').filter(child => (
        child.isClassDeclaration() && child.get('id').isIdentifier({ name: tagName })
      ))
      if (classes.length === 1) {
        return getCurrentFileUniqueName(classes[0])
      }
    }

    // TODO: update 同getClassType，可逐级查找。
    function getPureFunctionType() {
      const parent = path.findParent((node) => node.isProgram())
      const VariableDecls = parent.get('body').filter(child => (
        child.isVariableDeclaration() && child.get('declarations.0').get('id').isIdentifier({ name: tagName })
      ))
      if (VariableDecls.length === 1) {
        return getCurrentFileUniqueName(VariableDecls[0].get('declarations.0'))
      }
    }

    // 1. import Foo from './foo'
    let mapName = ''
    if (mapName = getImportType()) {
      return mapName
    }
    // 2. class T2 extends Component {}
    if (mapName = getClassType()) {
      return mapName
    }
    // 3. const T3 = () => <>xxx</>
    if (mapName = getPureFunctionType()) {
      return mapName
    }
  
    // TODO: add 支持当前文件的纯函数类型组件
    const msg = `未识别到引用的组件 ${tagName}`
    throw Error(msg)
  }

  traverse(ast, {
    JSXElement(path) {
      const parentNodeName = getParentNodeName(path)
      ctx.addFsRelation(parentNodeName, getCurrentFileUniqueName(path))

      const nodeInfo = extractJSXNodeInfo(path)
      const {
        uniqueId,
        tagName,
      } = nodeInfo
      ctx.addUniqueNodeInfo(uniqueId, nodeInfo)

      // 临时方案：对于自定义的组件，默认从当前文件的Class中进行匹配
      if (ctx.isUserComponent(tagName)) {
        ctx.addFsRelation(getCurrentFileUniqueName(path), getComponentMapName(tagName, currentPath, path))
      }
    },

    ClassMethod(path) {
      const parentNodeName = getParentNodeName(path)
      ctx.addFsRelation(parentNodeName, getCurrentFileUniqueName(path))
    },

    JSXExpressionContainer(path) {
      const expression = path.get('expression')
      // case1: { this.renderA() }
      if (expression.isCallExpression()) {
        if (expression.get('callee').get('object').isThisExpression()) {
          const fnName = expression.get('callee').get('property').node.name
          console.log(fnName);
          const matched = getMatchFnUpward(path, fnName, 'ClassMethod')
          if (!matched) {
            throw '找不到JSXExpressionContainer中匹配的父级'
          }
          const parentNodeName = getParentNodeName(path)
          ctx.addFsRelation(parentNodeName, getCurrentFileUniqueName(matched))
        }
      }
    }
  })
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
