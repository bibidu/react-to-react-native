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
      id: '',
      uniqueId: '',
    }
    const attributes = openingElement.get('attributes')
    for (let attr of attributes) {
      ;['className', 'id', 'uniqueId'].forEach(attrName => {
        const key = attrName === 'uniqueId' ? ctx.enums.UNIQUE_ID : attrName
        if (attr.get('name').isJSXIdentifier({ name: key })) {
          result[attrName] = getJSXElementAttrValuePath(attr.get('value'))
        }
      })
    }
    return result
  }

  function getJSXElementAttrValuePath(JSXElementAttrValuePath) {
    // className="title"
    if (JSXElementAttrValuePath.isStringLiteral()) {
      return JSXElementAttrValuePath.node.value
    }
    if (JSXElementAttrValuePath.isJSXExpressionContainer()) {
      const expression = JSXElementAttrValuePath.get('expression')
      // className={"title"}
      if (expression.isStringLiteral()) {
        return expression.node.value
      }
      if (expression.isTemplateLiteral()) {
        const quasis = expression.quasis
        // className={`title ${activeClassName}`}
        if (quasis.length !== 1) {
          ctx.error('暂不支持在className、id上含有多个quasis的TemplateLiteral')
        } else {
          return quasis[0].value.raw
        }
      }
    }
    return 'nullnull'
  }

  return {
    JSXElement(path) {
      const parentNodeName = getParentNodeName(path)
      ctx.addFsRelation(parentNodeName, getCurrentFileUniqueName(path))

      const nodeInfo = extractJSXNodeInfo(path)
      const { className, id, tagName, uniqueId, } = nodeInfo
      ctx.addUniqueNodeInfo(uniqueId, {
        className,
        id,
        tagName,
        uniqueId,
      })
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
