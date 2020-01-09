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
module.exports = function astToRelationTree({ ctx, t }) {
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
    const expressions = templateLiteralPath.get('expressions')
    const expressionCodeArr = expressions.map(exp => ctx.astUtils.ast2code(exp.node))
    return expressionCodeArr
  }

  function getParentNodeName(path) {
    const parentNode = path.findParent((p) => (
      p.isJSXElement() ||
      p.isClassMethod() || 
      p.isFunctionDeclaration() || 
      p.isClassDeclaration()
    ))

    return getCurrentFileUniqueName(parentNode)
  }

  function getCurrentFileUniqueName(path) {
    const { start, end } = path.node
    // uniquePrefix 用于开发调试时定位元素的位置
    // let uniquePrefix
    // if (start) {
    //   uniquePrefix = String(`[${start}-${end}]-`)
    // } else {
    //   // 添加的textWrapper不存在start、end属性
    //   const firstChild = path.get('children.0').node
    //   uniquePrefix = String(`[${firstChild.start}-${firstChild.end}]-$-`)
    // }

    let base = ''

    if (path.isJSXElement()) {
      base = getJSXUniqueId(path) + '-' + 'JSXElement-' + path.get('openingElement').get('name').node.name
    } else if (path.isClassMethod()) {
      const classMethodPrefix = getClassMethodPrefix(path)
      base = classMethodPrefix + path.get('key').node.name
    } else if (path.isFunctionDeclaration()) {
      base = 'Function-' + path.get('id').node.name
    } else if (path.isClassDeclaration()) {
      base = 'Class-' + path.get('id').node.name
    } else {
      this.error('JSXElement父级不合法')
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
    const exportClasses = ctx.collections.exports
    if (exportClasses.length === 1) {
      const parentClass = path.findParent(p => p.isClassDeclaration())
      if (parentClass.get('id').isIdentifier({ name: exportClasses[0] })) {
        return 'ROOT-'
      } else {
        return 'ClassMethod-'
      }
      // const parentClass = 
      // const parent
    } else {
      throw Error('暂只支持暴露单组件')
    }
  }

  function extractJSXNodeInfo(JSXElementPath) {
    const openingElement = JSXElementPath.get('openingElement')
    const tagName = openingElement.get('name').node.name
    const result = {
      tagName,
      className: '',
      activeClassName: '',
      id: '',
      activeId: '',
      uniqueId: '',
    }
    const attributes = openingElement.get('attributes')
    for (let attr of attributes) {
      ;['className', 'id', 'uniqueId'].forEach(attrName => {
        const key = attrName === 'uniqueId' ? ctx.enums.UNIQUE_ID : attrName
        if (attr.get('name').isJSXIdentifier({ name: key })) {
          const { staticExpression, activeExpression } = getAttrValueExactly(attr.get('value'))
          const activeKey = 'active' + attrName.replace(/^\w/, (_) => _.toUpperCase())
          result[attrName] = staticExpression
          result[activeKey] = activeExpression
        }
      })
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

  return {
    JSXElement(path) {
      const parentNodeName = getParentNodeName(path)
      ctx.addFsRelation(parentNodeName, getCurrentFileUniqueName(path))

      const nodeInfo = extractJSXNodeInfo(path)
      const {
        className,
        id,
        tagName,
        uniqueId,
        activeClassName,
        activeId,
      } = nodeInfo
      ctx.addUniqueNodeInfo(uniqueId, {
        className,
        id,
        tagName,
        uniqueId,
        activeClassName,
        activeId,
      })

      // 临时方案：对于自定义的组件，默认从当前文件的Class中进行匹配
      if (tagName.charAt(0) !== tagName.charAt(0).toLowerCase()) {
        ctx.addFsRelation(getCurrentFileUniqueName(path), `Class-${tagName}`)
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
    }
  }
}
