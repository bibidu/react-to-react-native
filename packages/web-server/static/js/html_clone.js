
var hasKnowWarnings = [
  '所有属性都具有固定width/height，需自行删除',
  'backgroundPosition直接设置导致设置背景属性无效。如background: rgba(255, 255, 255, 0.125) none no-repeat scroll right 8px 50% / auto padding-box border-box'
]
// 节省计算时间
var defaultValue = {
  fontSize: {
    'default': 12,
    h1: 32,
    h2: 24,
    h3: 18.72,
    h4: 16,
    h5: 13.28,
    h6: 12,
  }
}
// 属性白名单
var whiteList = [
  'margin',
  'padding',
  'background',
  'background-image',
  'color',
  'position',
  'top',
  'left',
  'right',
  'bottom',
  'border-top',
  'border-bottom',
  'border-left',
  'border-right',
  'width',
  'height',
  'font-size',
  'border-radius',
  'display',
  'flex',
  'flex-direction',
  'align-items',
  'justify-content',
  'transform',
  'z-index',
  'transition',
  'float',
  'text-align',
  'vertical-align',
  'line-height',
  'text-decoration',
  'text-overflow',
  'overflow',
  'list-style',
  'fill', // valid when tagName is SVG
  'flex-flow', // 
  'box-sizing',
  'box-shadow',
  'clear',
]
var camelWhiteList = whiteList.map(item => camelCase(item))
var blockTag =[
  'DIV',
  'P',
  'H1',
  'H2',
  'H3',
  'H4',
  'H5',
  'H6',
  'DIV',
  'OL',
  'UL',
  'DL',
  'TABLE',
  'ADDRESS',
  'FORM',
  'BLOCKQUOTE',
]
// 过滤属性的条件
var filterConditions = [
  (k, v, el) => isDefaultAttribute({ k, v, el }),
  (k, v, el, styles) => isInValidAttribute({ k, v, el, styles }),
  (k, v, el, styles) => isInHeritSourceAttribute({ k, v, el, styles }),
]
var canInheritStyleName = [
  'fontSize',
  'color',
  'lineHeight',
  'fontWeight',
  'textAlign',
  'visibility',
  'cursor'
]
// 需要最终移除的属性
var clearAttrNames = [
  'style'
]
// 唯一类名选择器id
var id = 0
var id2 = 0
// 最终生成的样式字符串
var styleStr = ''
// 缓存tagName对应的ComputedStyle
var cacheElStyles = {}
// 是否对fontSize作近似处理
var fontSizeSimilarize = true
var deleteEls = []

// <!----------------------------- utils start----------------------------->
function camelCase(word) {
  const camelRE = /-(\w)/
  return word.replace(camelRE, (_, w) => w.toUpperCase())
}
function hyphenCase(word) {
  const hyphenRE = /([a-z])([A-Z])/
  return word.replace(hyphenRE, (_, w, h) => w + '-' + h.toLowerCase())
}
function allEqual(...args) {
  let init = args[0]
  for (let i = 1; i < args.length; i++) {
    if (args[i] !== init) {
      return false
    }
  }
  
  return true
}
function genId() {
  return `gen${++id}`
}
function genId2() {
  return `gen${++id2}`
}

function safeSetObj(obj, index, k, v) {
  if (!obj[index]) {
    obj[index] = {}
  }
  obj[index][k] = v
}

/**
 * 是否是继承而来的属性
 * 
 */
function isInHeritSourceAttribute({ k, v, el, styles }) {
  const isInlineNode = styles.display === 'inline' || styles.display === 'inline-block'
  
  if (
    k === 'color' // 所有元素都可以继承 `color` 属性
    || k === 'fontSize' // 所有元素都可以继承 `fontSize` 属性
    || (isInlineNode && canInheritStyleName.includes(k))
  ) {
    const parent = el.parentNode
    if (!parent) return false

    const parentStyle = getComputedStyle(parent)
    const parentMapValue = parentStyle[k]

    // fontSize 单独处理
    if (k === 'fontSize') {
      const elMapFontSize = fontSizeSimilarize ? Math.round(extractFontSize(styles.fontSize)) : extractFontSize(styles.fontSize)

      // fontSize的值和tagName对应的值相等 则忽略该属性
      const tagNameMapFontSize = defaultValue.fontSize[el.tagName.toLowerCase()] || defaultValue.fontSize.default
      const similarized = fontSizeSimilarize ? Math.round(tagNameMapFontSize) : tagNameMapFontSize
      
      if (similarized === elMapFontSize) return true

      // fontSize的值和父级相等 则忽略该属性
      const parentMapFontSize = fontSizeSimilarize ? Math.round(extractFontSize(parentMapValue)) : extractFontSize(parentMapValue)

      // 和父级相同且和自身属性值相同。
      // 需要满足 和自身属性值 相同的原因：
      // 举例：父级div 16px。子h1 16px。 看似满足前一部分，返回true，即不给h1添加额外样式。但最终的表现h1具有自带样式fontSize 36px
      // 所以需要添加后一部分判断。即 需要元素本身不存在非正常的fontSize
      if (elMapFontSize === parentMapFontSize && !['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'BUTTON'].includes(el.tagName)) {
        return true
      }
      return false
    }

    // a 标签的 `color` 不继承
    if (k === 'color' && ['A', 'BUTTON'].includes(el.tagName)) {
      return false
    }
   
    return parentMapValue === v
  }
}
/**
 * 是否是无效的属性值
 */
function isInValidAttribute({ k, v, el, styles }) {
  /* 属性的组合是否无效 */
  // 块元素无需设置display block
  if (k === 'display' && v === 'block' && blockTag.includes(el.tagName)) 
    return true
  // 行内元素无需设置display inline
  if (k === 'display' && v === 'inline' && !blockTag.includes(el.tagName)) 
    return true
  
  /* 属性的值是否无效 */
  switch(k) {
    case 'borderTop':
    case 'borderBottom':
    case 'borderLeft':
    case 'borderRight':
      return !['INPUT', 'BUTTON', 'TEXTAREA'].includes(el.tagName) && v.startsWith('0px')

    case 'textDecoration':
      return !['A'].includes(el.tagName)

    case 'display': 
      return Boolean(v === 'none')
    
    case 'visible':
      return Boolean(!v)
    
    case 'opacity':
      return Boolean(!v)
    
    case 'listStyle':
      return !['UL', 'LI'].includes(el.tagName)
  
    case 'margin':
    case 'padding':
      return !['UL', 'LI', 'FIGURE', 'P'].includes(el.tagName) && ['0px'].includes(v)
    
    case 'boxSizing':
      return ['0px'].includes(styles.padding) && v === 'border-box'

    case 'textAlign':
      return ['start', 'left'].includes(v) && !['TH'].includes(el.tagName)

    case 'top':
    case 'bottom':
    case 'left':
    case 'right':
      return v === 'auto' || (
        v === '0px' && !['absolute', 'fixed'].includes(styles.position)
      )
  }
}
/**
 * 是否是元素的默认值
 * 由于getComputedStyle返回的是计算后的样式，所以当不同的样式环境下，表现出的样式默认值不同，如position的默认值可以是0px或auto
 * 所以考虑对不同的样式名进行单独判断
 */
function isDefaultAttribute({ k, v, el }) {
  switch(k) {
    case 'position':
      return ['0px', 'auto', 'static'].includes(v)

    case 'flexDirection':
      return ['row'].includes(v)

    case 'transform':
    case 'backgroundImage':
      return ['none'].includes(v)
    
    case 'zIndex':
      return ['auto'].includes(v)
    
    case 'float':
      return ['none'].includes(v)

    case 'verticalAlign':
      return ['baseline'].includes(v)

    case 'borderRadius':
      return ['0px'].includes(v)
    
    case 'overflow':
      return ['visible', 'auto'].includes(v)

    case 'justifyContent':
    case 'alignItems':
    case 'lineHeight':
      return ['normal', 'flex-start'].includes(v)
    
    case 'width': 
    case 'height': 
      return ['auto'].includes(v)
    
    case 'fill':
      return ['rgb(0, 0, 0)'].includes(v)

    case 'transition':
      return ['all 0s ease 0s'].includes(v)

    case 'textOverflow': 
      return ['clip'].includes(v)

    case 'textDecoration':
      return ['underline'].includes(v)

    case 'flex':
      return ['0 1 auto'].includes(v)
    
    case 'flexFlow':
      return ['row nowrap'].includes(v)

    case 'boxSizing':
      return ['content-box'].includes(v)

    case 'boxShadow':
    case 'clear':
      return ['none'].includes(v)
    
  }
}
// 提取单位像素中的值，如16px -> 16
function extractFontSize(withUnit) {
  return Number(withUnit.split('px')[0])
}

function testUtil(classSelector) {
  if (classSelector === 'body') return document.body
  return document.querySelector('.' + classSelector.split(' ').join('.'))
}
// <!----------------------------- utils end----------------------------->

function calcNeedPatchedStyle(el) {
  const tagMapEl = document.createElement(el.tagName)
  const baseStyle = getComputedStyle(tagMapEl)

  const needPatched = {}

  Object.keys(baseStyle).forEach(k => {
    if (camelWhiteList.includes(k)) {
      const styles = getComputedStyle(el)
      const current = styles[k]
      // 自定义规则
      const shouldSaveStyle = attributeUserInterceptor({ k, v: current, el, styles})
      if (shouldSaveStyle) {
        // 过滤属性值
        const shouldRecord = attributeInterceptor(k, current, el, styles)
        if (shouldRecord && getComputedStyle(tagMapEl)[k] !== current) {
          const camelAttrName = hyphenCase(k)
          let value = styles[k]
          // 校正属性值
          value = correctAttributeValue(camelAttrName, value)
          needPatched[camelAttrName] = value
        }
      }
    }
  })
  
  // patch前过滤
  filterBeforePatch(needPatched)
  return needPatched
}

function generateStyle(style) {
  if (Object.keys(style).length) {
    const id = genId()
    let str = ''
    Object.entries(style).forEach(([k, v]) => {
      str += `${k}: ${v};`
    })
    // styleStr += `#${id}{${str}}`
    styleStr += `.${id}{${str}}`
    return id
  }
}

function addStyleAndUpdateClass(el, clone, isRoot) {
  const patchedStyle = calcNeedPatchedStyle(el)
  // 用于被子元素继承的属性
  if (isRoot) {
    const computed = getComputedStyle(el)
    Object.keys(computed).forEach(k => {
      if (canInheritStyleName.includes(k)) {
        patchedStyle[hyphenCase(k)] = computed[k]
      }
    })
  }
  const id = generateStyle(patchedStyle)
  if (id) {
    clone.classList.add(id)
  }
  clearAttrNames.forEach(name => clone.removeAttribute(name))
}

function cloneElementToHtml(el, clone, isRoot = true) {
  if (elShouldSkip(el)) {
    deleteEls.push(clone)
    return
  }

  addStyleAndUpdateClass(el, clone, isRoot) // 根节点的getComputedStyle均进行保存用于 `子元素继承`
  afterInterceptor(el, clone)
  el.childNodes && Array.from(el.childNodes).forEach((childNode, idx) => {
    const cloneNode = clone.childNodes[idx]
    // 注释节点
    if (childNode.nodeType === 8 || ['SCRIPT', 'LINK'].includes(childNode.tagName)) {
      // deleteEls.push(childNode)
      deleteEls.push(cloneNode)
    } else {
      if (
        childNode.nodeType !== 3 // 文本节点
      ) {
        if (cloneNode && cloneNode.nodeType !== 3) {
          cloneElementToHtml(childNode, cloneNode, false)
        }
      }
    }
  })

  // deleteEls.forEach(el => el.remove())

  if (!isRoot) return
  const classAttr = clone.classList && clone.classList.length ? `class="${Array.from(clone.classList || []).join(' ')}"` : ''
  // const classAttr = clone.id ? `id="${clone.id}"` : ''
  deleteEls.forEach(el => el.remove())

  return `
  <html>
    <head>
      <style>
        ${styleStr}
      </style>
    </head>
    <body>
      <${clone.tagName.toLowerCase()} ${classAttr}>
        ${clone.innerHTML}
      </${clone.tagName.toLowerCase()}>
    </body>
  </html>
  `
}
// 是否需要跳过
function elShouldSkip(el) {
  if (
    [3, 8].includes(el.nodeType)
    || (el.style && el.style.display === 'none')
    || ['STYLE', 'SCRIPT'].includes(el.tagName)
    || getComputedStyle(el).display === 'none'
    // || getComputedStyle(el).width === '0px'
    // 高度为0px时，子元素仍然可能显示
    // || getComputedStyle(el).height === '0px'
  ) {
    return true
  }
}
// 过滤属性值
function attributeInterceptor(k, v, el, styles) {
  for (let i = 0; i < filterConditions.length; i++) {
    if (filterConditions[i](k, v, el, styles)) {
      return false
    }
  }
  
  return true
}

// 校正属性值
function correctAttributeValue(camelAttrName, value) {
  // fontSize 校正
  if (camelAttrName === 'font-size') {
    value = (Number(value.split('px')[0]) - 1) + 'px'
  }

  return value
}

// patch前过滤
function filterBeforePatch(style) {
  // 合并 border
  if (style['border-top'] && allEqual(style['border-top'], style['border-bottom'], style['border-left'], style['border-right'])) {
    style.border = style['border-top']
    delete style['border-top']
    delete style['border-bottom']
    delete style['border-left']
    delete style['border-right']
  }
}
// <!----------------------------- userInterface start----------------------------->
// 是否匹配自定义规则
function attributeUserInterceptor({ k, v, el, styles }) {
  return true
}
// 自定义拦截器
function afterInterceptor(el, clone) {
  if (location.href.includes('https://tt.edu.au')) {
    // test website:   https://ci.jenkins.io/view/Projects/builds
    const base = 'https://tt.edu.au'
    if (el.tagName === 'IMG') {
      clone.setAttribute('src', base + el.getAttribute('src'))
    }
  }
}
// <!----------------------------- userInterface end----------------------------->

// 启动应用
function setup(el) {
  const clone = el.cloneNode(true)

  const html = cloneElementToHtml(el, clone)
  // console.clear()
  console.log(hasKnowWarnings.length ? hasKnowWarnings : '');
  // console.log(html)
  return html
}