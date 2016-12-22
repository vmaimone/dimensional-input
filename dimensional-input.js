const vDimensionalInput = {
  name: 'dimension-input',
  template: '           \
    <input              \
      type="text"       \
      v-model="local"   \
      @change="changed" \
      @keydown="keydown"\
      @input="input"    \
      @blur="blur">     \
  ',
  props: {
    value: [String, Number],
    precision: {
      type: Number,
      default: 5
    },
    units: {
      type: String,
      default: 'ft'
    }
  },
  data() {
    return {
      local: this.value || '',
      DIMENSIONAL_INPUT_WHITELIST: Object.freeze([
        '0','1','2','3','4','5','6','7','8','9',
        ' ','\'','"','.',
        'Backspace','Shift','Meta','Alt','Control','Enter','Tab',
        'ArrowLeft','ArrowRight','ArrowUp','ArrowDown',
      ])
    }
  },
  watch: {
    value(current, previous) {
      if (previous && !current) this.local = ''
    }
  },
  methods: {
    keydown(event) {
      if (!(event.metaKey || event.ctrlKey)) {
        if(!this.isWhitelisted(event.key)) return event.preventDefault()
      }
    },
    blur() {
      this.local = this.converted
      return this.$emit('blur', this.local)
    },
    changed() {
      console.log('changed!')
      return this.$emit('input', this.converted)
    },
    input() {
      return this.$emit('input', this.converted)
    },
    isWhitelisted(key) {
      return this.DIMENSIONAL_INPUT_WHITELIST.indexOf(key) > -1
    },
    round(number, precision) {
      let factor = Math.pow(10, precision);
      let roundedTempNumber = Math.round(number * factor);
      return roundedTempNumber / factor;
    },
    toNumeric(string) {
      let value = String(string || '').trim().replace(/('|"|\s)/g, '')
      return Number(value) || 0
    }
  },
  computed: {
    parts() {
      if (!isNaN(this.local)) {
        return {
          feet: this.units === 'in' ? 0 : this.toNumeric(this.local),
          inches: this.units === 'ft' ? 0 : this.toNumeric(this.local)
        }
      } else {
        let parts = String(this.local).trim().split(' ')
        let ft = parts.find(str => str.indexOf('\'') > -1)
        let inch = parts.find(str => str.indexOf('"') > -1)
        return {
          feet: this.toNumeric(ft),
          inches: this.toNumeric(inch)
        }
      }
    },
    converted() {
      let dims = this.parts
      let value = this.units == 'in'
        ? (dims.feet*12 + dims.inches)
        : (dims.feet + dims.inches/12)
      return this.round(value, this.precision || 5)
    }
  }
}

if (typeof module !== 'undefined' && typeof require === 'function') {
  module.exports = vDimensionalInput
} else if (typeof window !== 'undefined') {
  window.vDimensionalInput = vDimensionalInput
}