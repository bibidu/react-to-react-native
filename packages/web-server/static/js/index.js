const exampleEl = '.pre-code'
const resultEl = '.after-code'
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

const vue = new Vue({
  el: '#app',
  data() {
    return {
      loading: false,
      examples: [],
      preCodeMir: null,
      afterCodeMir: null,
      selectValue: -1,
      exampleKeys: ['inputJs', 'inputCss'],
      inputFileType: 0,
      inputFileTypes: ['JSX', 'SCSS'],
      outputFileType: -1,
      outputFileTypes: [],
      currentExampleIndex: -1,
      outputs: [],
      editing: []
    }
  },
  watch: {
    currentExampleIndex(index) {
      this.inputFileType = 0
      const key = this.exampleKeys[this.inputFileType]
      const value = this.examples[index][key]
      this.preCodeMir.setValue(value)
      // clear output
      this.clearOutput()
      this.clearEditing()
    },
    inputFileType(index) {
      const editContent = this.editing[index]
      const key = this.exampleKeys[index]
      const value = this.examples.length ? this.examples[this.currentExampleIndex][key] : ''
      this.preCodeMir.setValue(editContent !== undefined ? editContent : value)
    },
    outputFileType(index) {
      if (index === -1) {
        this.afterCodeMir.setValue('')
      } else {
        const value = this.outputs[index]
        const toStringValue = Array.isArray(value) ? value.join('\n\n') : value
        this.afterCodeMir.setValue(value.length ? toStringValue : '')
      }
    }
  },
  methods: {
    init() {
      this.initCodeMirror()
    },
    initCodeMirror() {
      this.examples = examples || []

      this.preCodeMir = this.createCodeMirror(exampleEl)
      this.afterCodeMir = this.createCodeMirror(resultEl, { readOnly: true })

      this.preCodeMir.on("change", (v) => {
        const value = this.preCodeMir.getValue()
        this.editing[this.inputFileType] = value
      });

      if (this.examples.length) {
        this.toggleExample(0)
      }
    },
    createCodeMirror(el, options) {
      return CodeMirror.fromTextArea(
        document.querySelector(el),
        Object.assign({}, {
          mode: "jsx",
          lineNumbers: true,// 显示行号
          smartIndent: true , //智能缩进
          indentUnit: 2, // 智能缩进单位为4个空格长度
          indentWithTabs: true,  // 使用制表符进行智能缩进
          lineWrapping: true,
        }, options || {})
      );
    },
    toggleFileTypes(type, index) {
      this[`${type}FileType`] = index
    },
    toggleExample(index) {
      this.currentExampleIndex = index
    },
    fetchCompile(js, css) {
      return new Promise(resolve => {
        fetch('//r2rn.bib1du.com/compile', {
            body: JSON.stringify({
                reactCompString: js,
                cssString: css,
            }),
            headers:{
                'content-type':'application/json'
            },
            method: 'POST'
        }).then(res => res.json()).then(res => resolve(res.data.result))
      })
    },
    compile() {
      this.loading = true
      // clear current
      this.clearOutput()

      const [jsKey, cssKey] = this.exampleKeys
      const [editJs, editCss] = this.editing
      const js = editJs !== undefined ? editJs : (
        this.examples.length ? this.examples[this.currentExampleIndex][jsKey]
          : ''
      )
      const css = editCss !== undefined ? editCss : (
        this.examples.length ? this.examples[this.currentExampleIndex][cssKey]
          : ''
      )

      sleep(300)
        .then(() => {
          return this.fetchCompile(js, css)
        })
        .then(res => {
          const outputFileTypes = []
          const outputs = []
          res.forEach(item => {
            outputFileTypes.push(Object.keys(item)[0])
            outputs.push(Object.values(item)[0])
          })
          this.outputFileTypes = outputFileTypes
          this.outputs = outputs
          this.outputFileType = 0
          this.loading = false
        })
    },
    clearOutput() {
      this.outputFileType = -1
      this.outputFileTypes = []
      this.outputs = []
    },
    clearEditing() {
      this.editing = []
    }
  },
  mounted () {
    this.init()
  }
})
  