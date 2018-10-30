<template>
  <div class="header-wrapper" :class="{ editable: editMode }">
    <h1  @click="editHeader" v-show="content.text && content.text.length" class="header-text">{{ content.text }}</h1>
    <div v-show="editMode && content.image && content.image.length" class="header-id">header</div>
    <div @click="editHeader" v-show="content.image && content.image.length" class="header-image" :style="backgroundStyle" />
    <b-modal :active.sync="editFormOpened" has-modal-card>
      <HeaderForm v-bind="editFormData" @close="closeForm" />
    </b-modal>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import HeaderForm from './HeaderForm.vue'

interface HeaderData {
  text?: string;
  image?: string;
}

export default Vue.extend({
  props: {
    content: {
      type: Object as () => HeaderData,
      required: true
    },
    editMode: Boolean
  },
  components: {
    HeaderForm
  },
  data () {
    return {
      backgroundStyle: {},
      editFormOpened: false,
      editFormData: { data: {} }
    }
  },
  created () {
    if (this.content.image && this.content.image.length) {
      this.backgroundStyle = {
        backgroundImage: 'url(' + this.content.image + ')'
      }
    }
  },
  methods: {
    editHeader () {
      if (this.editMode) {
        console.log(`user wants to edit header`)
        this.editFormData.data = Object.assign({}, this.content)
        this.editFormOpened = true
      }
    },
    closeForm (dataUpdated: boolean) {
      if (dataUpdated) {
        // console.log('emitting headerUpdate')
        this.$emit('headerUpdate', this.editFormData.data)
      }
      this.editFormOpened = false
    }
  }
})

export { HeaderData }
</script>

<style lang="scss">
@import "../assets/shared";
.header-wrapper {
  &.editable {
    cursor: pointer;
    &:hover {
      .header-text,
      .header-id {
        background-color: $color-shade;
        color: $color-secondary;
      }
    }
  }
}
.header-image {
  width: 16rem;
  height: 10rem;
  margin: 0 auto -6rem;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}
.header-id {
  position: absolute;
  color: $color-shade;
  font-style: italic;
  padding: 0.1rem 0.6rem;
  left: calc(50% - 2rem);
  top: 1rem;
  background-color: $color-secondary;
  pointer-events: none;
}
</style>
