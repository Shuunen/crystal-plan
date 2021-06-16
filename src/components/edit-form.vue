<template>
  <form action="#" @submit.prevent="close">
    <div class="modal-card" style="width: auto;">
      <section v-if="data" class="modal-card-body">
        <b-input v-model="data.id" placeholder="Id" />
        <b-input v-model="data.text" placeholder="Text" />
        <b-input v-model="data.image" placeholder="Image url" />
        <!-- https://fontawesome.com/icons?d=gallery&s=regular&m=free -->
        <b-input v-model="data.icon" placeholder="Font-Awesome Icon" />
      </section>
      <footer class="modal-card-foot">
        <button class="button" type="reset" @click="cancel">Cancel</button>
        <button v-if="data && data.type" class="button" type="reset" :class="{ 'is-warning': validateDelete }" @click="remove">
          {{ validateDelete ? "Yes delete !" : "Delete ?" }}
        </button>
        <button class="button is-primary" type="submit">Save</button>
      </footer>
    </div>
  </form>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { copy } from 'shuutils'

export interface EditFormData {
  id?: string
  text?: string
  image?: string
  icon?: string
  type?: string
}

@Component
export default class EditForm extends Vue {
  @Prop() private data!: EditFormData

  originalData = {} as EditFormData;
  validateDelete = false;

  created () {
    this.originalData = copy(this.data)
  }

  cancel () {
    console.log('user just canceled edit')
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
  }

  remove () {
    if (this.validateDelete) {
      console.log('user wants to delete entry')
      this.$emit('remove')
    } else {
      this.validateDelete = true
    }
  }

  close () {
    console.log('user finished edition')
    this.$emit('close')
  }
}
</script>
