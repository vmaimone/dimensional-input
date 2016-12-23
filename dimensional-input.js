'use strict'

var vDimensionalInput = {
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
  data: function data () {
    return {
      local: this.value || '',
      DIMENSIONAL_INPUT_WHITELIST: Object.freeze([
        '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
        ' ', "'", '"', '.',
        'Backspace', 'Shift', 'Meta', 'Alt', 'Control', 'Enter', 'Tab',
        'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'
      ])
    }
  },

  watch: {
    value: function value (current, previous) {
      if (previous && !current) this.local = ''
    }
  },
  methods: {
    keydown: function keydown (event) {
      if (!(event.metaKey || event.ctrlKey)) {
        if (!this.isWhitelisted(event.key)) return event.preventDefault()
      }
    },
    blur: function blur () {
      this.local = this.converted
      return this.$emit('blur', this.local)
    },
    changed: function changed () {
      console.log('changed!')
      return this.$emit('input', this.converted)
    },
    input: function input () {
      return this.$emit('input', this.converted)
    },
    isWhitelisted: function isWhitelisted (key) {
      return this.DIMENSIONAL_INPUT_WHITELIST.indexOf(key) > -1
    },
    round: function round (number, precision) {
      var factor = Math.pow(10, precision)
      var roundedTempNumber = Math.round(number * factor)
      return roundedTempNumber / factor
    },
    toNumeric: function toNumeric (string) {
      var value = String(string || '').trim().replace(/('|"|\s)/g, '')
      return Number(value) || 0
    }
  },
  computed: {
    parts: function parts () {
      if (!isNaN(this.local)) {
        return {
          feet: this.units === 'in' ? 0 : this.toNumeric(this.local),
          inches: this.units === 'ft' ? 0 : this.toNumeric(this.local)
        }
      } else {
        var parts = String(this.local).trim().split(' ')
        var ft = parts.find(function (str) {
          return str.indexOf("'") > -1
        })
        var inch = parts.find(function (str) {
          return str.indexOf('"') > -1
        })
        return {
          feet: this.toNumeric(ft),
          inches: this.toNumeric(inch)
        }
      }
    },
    converted: function converted () {
      var dims = this.parts
      var value = this.units == 'in' ? dims.feet * 12 + dims.inches : dims.feet + dims.inches / 12
      return this.round(value, this.precision || 5)
    }
  }
}

if (typeof module !== 'undefined' && typeof require === 'function') {
  module.exports = vDimensionalInput
} else if (typeof window !== 'undefined') {
  window.vDimensionalInput = vDimensionalInput
}
