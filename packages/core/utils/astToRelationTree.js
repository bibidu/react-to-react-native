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
    let static = ''
    const quasis = templateLiteralPath.get('quasis')
    quasis.forEach((item, index) => {
      const startWithEmpty = /^\s/.test(item.node.value.raw)
      const endWithEmpty = /\s$/.test(item.node.value.raw)
      const tpls = item.node.value.raw.split(' ').filter(Boolean)
      if (tpls.length) {
        const first = tpls.shift()
        if (startWithEmpty || index === 0) {
          static += first
        }
        if (tpls.length) {
          !endWithEmpty && tpls.pop()
          static += tpls.join(' ')
        }
      }
    })
    return static
  }
  
  function getQuasisActiveValueInTemplateLiteral(templateLiteralPath) {
    const active = []
    const expressionCodeArr = templateLiteralPath.get('expressions')
    const quasis = templateLiteralPath.get('quasis')
    expressionCodeArr.forEach((item, index) => {
      const isLast = expressionCodeArr.length - 1 === index
      const prefix = /\s$/.test(quasis[index].node.value.raw) ?
        [] : [quasis[index].node.value.raw.split(' ').pop()]
      const suffix = !isLast && !/^\s/.test(quasis[index + 1].node.value.raw) ?
        [quasis[index + 1].node.value.raw.split(' ').shift()] : []

      const newQuasis = prefix.concat(suffix).concat('').concat('').slice(0, 2)
      active.push(
        t.TemplateLiteral(
          newQuasis.map((item, idx) => (
            t.TemplateElement(
              {
                raw: item,
                value: item,
              },
              Boolean(newQuasis.length - 1 === idx)
            )
          )),
          [item.node]
        )
      )
    })
    return active
  }

  function getParentNodeName(path) {
    const parentNode = path.findParent((p) => (
      p.isJSXElement() ||
      p.isClassMethod() || 
      p.isFunctionDeclaration() || 
      p.isClassDeclaration() ||
      p.isVariableDeclarator() ||
      p.isClassProperty() ||
      p.isArrowFunctionExpression()
    ))
    
    return parentNode && getCurrentFileUniqueName(parentNode)
  }

  function getCurrentFileUniqueName(path) {
    let base = ctx.utils.hash(currentPath) + '-'

    if (path.isJSXElement()) {
      base += getJSXUniqueId(path) + '-' + 'JSXElement-' + ctx.jsxUtils.getTagName(path)
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
    } else if (path.isArrowFunctionExpression()) {
      base += 'ArrowFunction' +`${path.node.start}_${path.node.end}`
    } else {
      ctxlogger.error('JSXElement父级不合法')
    }
    const uniqueName = base
    // const uniqueName = config.isDefault ? base.split('-')[0] + '-Default' : base
    return uniqueName
  }

  function getMatchFnUpward(path, compareName, matchType) {
    if (matchType === 'ClassMethod') {
      const parentContainer = path.findParent((p) => p.isClassDeclaration())
      const classMethods = parentContainer.get('body').get('body')
      for (let clazzMethod of classMethods) {
        // Class内的闭包函数在tsCompile阶段会移至constructor内
        if (clazzMethod.get('key').isIdentifier({ name: 'constructor' })) {
          let result
          clazzMethod.traverse({
            AssignmentExpression(_path) {
              if (
                _path.get('left.object').isThisExpression() &&
                _path.get('left.property').isIdentifier({ name: compareName }) &&
                _path.get('right').isArrowFunctionExpression()
              ) {
                result = _path.get('right')
                _path.stop()
              }
            }
          })
          return result || clazzMethod
        } else if (clazzMethod.get('key').isIdentifier({ name: compareName })) {
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
      activeId: [],
      uniqueId: '',
      activeAddText: '',
      isActive: false, /* 是否是动态节点。如是动态节点，则启用运行时样式混合，否则，进行编译时混合。 */
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
          if (activeExpression) {
            result.isActive = true
            result[activeKey] = activeExpression
          }
        }
      })

      if (attr.get('name').isJSXIdentifier({ name: ctx.enums.UNIQUE_ID })) {
        const name = 'uniqueId'
        const { staticExpression } = getAttrValueExactly(attr.get('value'))
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
    let staticExpression = '', activeExpression = []
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
        // className={`title1 title-${activeIndex}`}
        if (validValue.isTemplateLiteral()) {
          staticExpression = getQuasisStaticValueInTemplateLiteral(validValue)
          activeExpression = getQuasisActiveValueInTemplateLiteral(validValue)
        }
      }
      // className={xx.classnames("title1", { 'title2-x': x === y })}
      if (expression.isCallExpression() && expression.get('arguments').length) {
        expression.get('arguments').forEach(item => {
          if (item.isLiteral()) {
            staticExpression += item.node.value + ' '
          } else if (item.isObjectExpression()) {
            item.get('properties').forEach(prop => {
              activeExpression.push(
                t.conditionalExpression(
                  prop.get('value').node,
                  prop.get('key').node,
                  t.stringLiteral('')
                )
              )
            })
          }
        })
      }
    }
    // console.log({
    //   staticExpression,
    //   activeExpression,
    // })
    return {
      staticExpression,
      activeExpression,
    }
  }

  function getComponentMapName(tagName, currentPath, path) {
    
    function getImportType() {
      const parent = path.findParent((p) => p.isProgram())

      for (let i = 0; i < parent.get('body').length; i++) {
        const item = parent.get(`body.${i}`)
        if (item.type === 'ImportDeclaration') {
          if (item.get('specifiers').length) {
            const importPath = item.get('source').node.value
            const name = item.get('specifiers.0.local').node.name
            if (name === tagName) {
              const file = resolveFile(currentPath, importPath)
              return `${ctx.utils.hash(file.entirePath)}-Default`
            }
          }
        }
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
    function getVariableFunctionType() {
      const parent = path.findParent((node) => node.isProgram())
      const VariableDecls = parent.get('body').filter(child => (
        child.isVariableDeclaration() && child.get('declarations.0').get('id').isIdentifier({ name: tagName })
      ))
      if (VariableDecls.length === 1) {
        return getCurrentFileUniqueName(VariableDecls[0].get('declarations.0'))
      }
    }

    function getES5FunctionType() {
      const parent = path.findParent((node) => node.isProgram())
      const FunctionNode = parent.get('body').filter(child => child.isFunctionDeclaration())
      if (FunctionNode.length) {
        return getCurrentFileUniqueName(FunctionNode[0])
      }
    }

    function getExportDefaultType() {
      const parent = path.findParent((p) => p.isProgram())

      for (let i = 0; i < parent.get('body').length; i++) {
        const item = parent.get(`body.${i}`)
        if (item.type === 'ExportDefaultDeclaration') {
          if (item.get('declaration.id').isIdentifier({ name: tagName })) {
            return getCurrentFileUniqueName(item.get('declaration'))
          }
        }
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
    if (mapName = getVariableFunctionType()) {
      return mapName
    }

    // 4. function T4() {}
    if (mapName = getES5FunctionType()) {
      return mapName
    }

    // 5. export default class T4
    if (mapName = getExportDefaultType()) {
      return mapName
    }
    
    // TODO: add 支持当前文件的纯函数类型组件
    const msg = `未识别到引用的组件 ${tagName}`
    throw Error(msg)
  }

  // let atLeastOneJSXElement = false
  traverse(ast, {
    JSXElement(path) {
      // if (!atLeastOneJSXElement) {
      //   atLeastOneJSXElement = true
      // }
      const parentNodeName = getParentNodeName(path)
      if (parentNodeName) {
        ctx.addFsRelation(parentNodeName, getCurrentFileUniqueName(path))
      }

      const nodeInfo = extractJSXNodeInfo(path)
      const {
        uniqueId,
        tagName,
      } = nodeInfo
      ctx.addUniqueNodeInfo(uniqueId, nodeInfo)

      // 临时方案：对于自定义的组件，默认从当前文件的Class中进行匹配
      if (ctx.utils.isUserComponent(tagName)) {
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
          const matched = getMatchFnUpward(path, fnName, 'ClassMethod')
          if (!matched) {
            throw '找不到JSXExpressionContainer中匹配的父级'
          }
          const parentNodeName = getParentNodeName(path)
          ctx.addFsRelation(parentNodeName, getCurrentFileUniqueName(matched))
        }
      }
    },

    ArrowFunctionExpression(path) {
      const classMethodAncestor = path.findParent((p) => p.isClassMethod())
      if (classMethodAncestor) {
        const parentNodeName = getParentNodeName(path)
        const name =  getCurrentFileUniqueName(path)
        if (name) {
          ctx.addFsRelation(parentNodeName, name)
        }
      }
    },

    ExportDefaultDeclaration(path) {
      // if (!atLeastOneJSXElement) {
      const filePathHash = ctx.utils.hash(currentPath)
      let rootClassName
      if (path.get('declaration').isIdentifier()) {
        rootClassName = path.get('declaration').node.name
      } else if (path.get('declaration').isClassDeclaration()) {
        rootClassName = path.get('declaration.id').node.name
      }
      // const currentClassNodeName = `${filePathHash}-Class-${rootClassName}`
      const currentClassNodeName = `${filePathHash}-Default`
      ctx.addFsRelation(currentClassNodeName, getComponentMapName(rootClassName, currentPath, path))
      // }
    }
  })
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
