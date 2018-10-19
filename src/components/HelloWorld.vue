<template>
  <div class="columns">
    <div class="hello column is-one-third is-offset-one-third">
      <h2 class="subtitle">Hello {{ name }} !</h2>
      <input class="input" type="text" v-model="newName" @change="setDraft" placeholder="new name">
      <p :class="[draftStatus]">Status of new name : {{ draftStatus }}</p>
      <div class="line">
        <button class="button is-primary" @click="applyDraft">Apply</button>
        <button class="button is-danger is-outlined" @click="clearDraft">Clear</button>
      </div>
    </div>
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
