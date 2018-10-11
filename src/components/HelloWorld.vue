<template>
  <div class="hello">
    <h1>Hello {{ name }} !</h1>
    <input type="text" v-model="newName" @change="setDraft" placeholder="new name">
    <p :class="[draftStatus]">Status of new name : {{ draftStatus }}</p>
    <button @click="applyDraft">Apply</button>
    <button @click="clearDraft">Clear</button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

declare module 'vue/types/vue' {
  interface VueConstructor {
    $storage: any
  }
}

export default Vue.extend({
  name: 'hello-world',
  data() {
    return {
      name: '',
      newName: '',
      draftStatus: ''
    }
  },
  created: function() {
    this.name = Vue.$storage.get('name', 'John (default)')
    this.newName = Vue.$storage.get('newName', '')
    this.draftStatus = Vue.$storage.get('draftStatus', 'none')
  },
  methods: {
    clearDraft(){
      this.newName = ''
      this.draftStatus = 'none'
      this.persist()
    },
    setDraft(){
      this.draftStatus = 'draft'
      this.persist()
    },
    applyDraft(){
      console.log('update name to', this.newName)
      this.name = this.newName
      this.newName = ''
      this.draftStatus = 'persisted'
      this.persist()
    },
    persist(){
      Vue.$storage.set('name', this.name)
      Vue.$storage.set('newName', this.newName)
      Vue.$storage.set('draftStatus', this.draftStatus)
    }
  }
});
</script>

<style lang="scss">
.draft { color: orange }
.persisted { color: olivedrab }
</style>
