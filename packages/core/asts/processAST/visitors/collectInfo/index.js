
module.exports = function collectInfo({ ctx, t }) {
  const visitor = {}

  Object.assign(visitor, {
    ImportDeclaration(path) {
      // 收集import xxx from 'react'并在转译时移除
      const isReactImport = path.get('source').isStringLiteral({ value: 'react' })
      if (isReactImport) {
        ctx.collections.importReactPath[ctx.currentCompilePath] = path.node
        path.remove()
      }
    },

    ExportDefaultDeclaration(path) {
      let name
      const declaration = path.get('declaration')
      if (declaration.isIdentifier()) {
        name = declaration.node.name
      } else if (declaration.isClassDeclaration() && declaration.get('id').isIdentifier()) {
        name = declaration.get('id').node.name
      }
      // 收集导出的组件名
      ctx.logger.log({ type: 'entry', msg: ctx.currentCompilePath })
      
      ctx.collections.exports[ctx.utils.hash(ctx.currentCompilePath)] = name
    },

    JSXElement(path) {
      const styleAttr = ctx.jsxUtils.getJSXAttributeValue(path, 'style')
      if (styleAttr) {
        const uniqueIdPrefix = ctx.enums.UNIQUE_ID
        const uniqueId = ctx.jsxUtils.getJSXAttributeValue(path, uniqueIdPrefix)
        const uniqueIdValue = uniqueId.node.value

        const isExpression = styleAttr.isJSXExpressionContainer()
        const isObjectExpression = isExpression && styleAttr.get('expression').isObjectExpression()
        let valueTypeIsNumberOrString = false
        if (isObjectExpression) {
          valueTypeIsNumberOrString = styleAttr.get('expression').get('properties').every(prop => {
            return prop.get('value').isStringLiteral() || prop.get('value').isNumericLiteral()
          })
        }
        const isConstantStyle = isObjectExpression && valueTypeIsNumberOrString

        // style={{[string]: string | number}}
        if (isConstantStyle) {
          const objStyle = ctx.astUtils.objAstToObj(styleAttr.get('expression'))
          ctx.addInitialInlineStyle(uniqueIdValue, objStyle)
        } else {
          let nodeInfo = ctx.uniqueNodeInfo[uniqueIdValue]
          if (!nodeInfo) {
            nodeInfo = {}
          }
          nodeInfo.isActive = true
          nodeInfo.activeStyle = [styleAttr.get('expression').node]
          ctx.addUniqueNodeInfo(uniqueIdValue, nodeInfo)
        }
        // 移除原style属性，最终生成新的style
        ctx.jsxUtils.getJSXAttribute(path, 'style').remove()
      }
    },
  })

  return visitor
}


