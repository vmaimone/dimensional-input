<template>
  <input
    type="text"
    v-model="local"
    @keydown="keydown"
    @input="input"
    @blur="blur">
</template>
<script>
export default {
  name: 'dimension-input',
  props: {
    value: [String, Number],
    units: {
      type: String,
      default: 'ft'
    }
  },
  data() {
    return {
      local: this.value || '',
      whitelist: Object.freeze([
        `0`,`1`,`2`,`3`,`4`,`5`,`6`,`7`,`8`,`9`,
        ` `,`'`,`"`,`.`,
        `Backspace`,`Shift`,`Meta`,`Alt`,`Control`,`Enter`,`Tab`,
        `ArrowLeft`,`ArrowRight`,`ArrowUp`,`ArrowDown`,
      ])
    }
  },
  methods: {
    keydown(event) {
      if(!this.isWhitelisted(event.key) && !event.metaKey && !event.ctrlKey) return event.preventDefault()
    },
    toNumeric(n) {
      return Number((n||'').toString().trim().replace(/('|"|\s)/g, '')) || 0
    },
    blur() {
      this.local = this.converted
      return this.$emit('blur', this.local)
    },
    input() {
      return this.$emit('input', this.converted)
    },
    isWhitelisted(key) {
      return this.whitelist.indexOf(key) > -1
    }
  },
  computed: {
    parts() {
      let parts = String(this.local).trim().split(' ')
      let ft = parts.find(str => str.indexOf(`'`) > -1)
      let inch = parts.find(str => str.indexOf(`"`) > -1)
      return {
        feet: this.toNumeric(ft),
        inches: this.toNumeric(inch)
      }
    },
    converted() {
      let dims = this.parts
      return this.units == 'in'
        ? (dims.feet/12 + dims.inches)
        : (dims.feet + dims.inches/12)
      return value
    }
  }
}
</script>
