<template>
  <div class="header-wrapper" :class="{ editable: editMode }">
    <h1 v-show="content.text && content.text.length" class="header-text" @click="clickHeader">{{ content.text }}</h1>
    <div v-show="editMode && content.image && content.image.length" class="header-id">header</div>
    <div v-show="content.image && content.image.length" class="header-image" :style="backgroundStyle" @click="clickHeader" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

export interface HeaderData {
  text?: string;
  image?: string;
}

@Component
export default class Header extends Vue {
  @Prop() private content!: HeaderData;
  @Prop() private editMode!: boolean;
  backgroundStyle = {};
  created () {
    if (this.content.image && this.content.image.length) {
      this.backgroundStyle = {
        backgroundImage: 'url(' + this.content.image + ')',
      }
    }
  }

  clickHeader () {
    if (this.editMode) {
      console.log('user wants to edit header')
      this.$emit('edit', this.content)
    } else {
      console.log('user wants to select header')
      this.$emit('select', this.content)
    }
  }
}
</script>

<style>
.header-wrapper.editable {
  cursor: pointer;
}
.header-wrapper.editable:hover .header-text,
.header-wrapper.editable:hover .header-id {
  background-color: var(--color-shade);
  color: var(--color-secondary);
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
  color: var(--color-shade);
  font-style: italic;
  padding: 0.1rem 0.6rem;
  left: calc(50% - 2rem);
  top: 1rem;
  background-color: var(--color-secondary);
  pointer-events: none;
}
</style>
