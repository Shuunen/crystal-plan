<template>
  <div class="chart">
    Edit is {{ editMode ? 'active' : 'inactive' }}
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
   props: {
    editMode: {
      type: Boolean,
      required: true,
    }
  },
  data() {
    return {
      active: false
    }
  },
  created: function() {
    this.active = Vue.$storage.get('edit-mode', false)
  },
  methods: {
    toggleActive(){
      const active = !this.active
      console.log('edit mode now', (active ? '' : 'in-') + 'active')
      Vue.$storage.set('edit-mode', active)
      this.$emit('edit-mode', active)
      this.active = active
    },
  }
});
</script>

<style lang="scss">
</style>
