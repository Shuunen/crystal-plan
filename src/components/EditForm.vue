<template>
  <form action="#" @submit.prevent="close">
    <div class="modal-card" style="width: auto">
        <section class="modal-card-body" v-if="data">
          <b-input v-model="data.id" placeholder="Id" />
          <b-input v-model="data.text" placeholder="Text" />
          <b-input v-model="data.image" placeholder="Image url" />
          <b-input v-model="data.icon" placeholder="Font-Awesome Icon" />
        </section>
        <footer class="modal-card-foot">
          <button class="button" type="reset" @click="cancel">Cancel</button>
          <button class="button is-primary" type="submit">Save</button>
        </footer>
    </div>
  </form>
</template>

<script lang="ts">
import Vue from 'vue'

interface EditFormData {
  id?: string;
  text?: string;
  image?: string;
  icon?: string;
}

export default Vue.extend({
  props: {
    data: Object as () => EditFormData
  },
  data () {
    return {
      originalData: {} as EditFormData
    }
  },
  created () {
    this.originalData = this.copy(this.data)
  },
  methods: {
    copy (object: any) {
      return JSON.parse(JSON.stringify(object))
    },
    cancel () {
      console.log(`user just canceled edit`)
      if (this.originalData.id) {
        this.data.id = this.originalData.id
      }
      if (this.originalData.text) {
        this.data.text = this.originalData.text
      }
      if (this.originalData.image) {
        this.data.image = this.originalData.image
      }
      if (this.originalData.icon) {
        this.data.icon = this.originalData.icon
      }
      this.close()
    },
    close () {
      console.log(`user finished edition`)
      this.$emit('close')
    }
  }
})
export { EditFormData }
</script>
