<template>
  <div class="bubble-wrapper col" :class="{ editable: editMode, selected: data.selected, shaded: data.shaded }">
    <div class="bubble-image" :style="backgroundStyle" />
    <div class="bubble-text text ellipsis">{{ data.text }}</div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { getRandomImageUrl, getRandomString, slugify } from 'shuutils'

export enum Sections {
  left = 'left',
  center = 'center',
  right = 'right'
}

export class BubbleData {
  id?: string
  text?: string
  section?: Sections
  icon?: string
  image?: string
  selected?: boolean = false;
  shaded?: boolean = false;
  constructor (data: BubbleData) {
    this.text = data.text || getRandomString()
    this.id = data.id || slugify(this.text)
    this.section = data.section || Sections.left
    this.image = data.image || getRandomImageUrl()
    this.icon = data.icon || ''
  }
}

@Component
export default class Bubble extends Vue {
  @Prop() private data!: BubbleData
  @Prop() private editMode!: boolean

  backgroundStyle = {};

  get image () {
    let path = getRandomImageUrl()
    if (!this.data) {
      console.warn('data not available, using default image...')
      return path
    }
    if (this.data.image && this.data.image.length > 0) {
      path = this.data.image
    } else {
      console.warn('image not available, using default one...')
    }
    return path
  }

  created () {
    this.backgroundStyle = { backgroundImage: 'url(' + this.image + ')' }
  }
}
</script>

<style>
.bubble-wrapper {
  --size: 5rem;

  position: relative;
  filter: grayscale(0);
  transition: all 0.4s;
  margin: calc(var(--size) / 4) 0;
  transform: scale(1);
}

.bubble-wrapper .bubble-text {
  font-size: 110%;
  background-color: var(--color-secondary);
  padding: 0 5px;
  position: absolute;
  bottom: calc(-1 * var(--size) / 2);
  max-width: calc(var(--size) * 1.8);
  transition: all 0.4s;
}

.bubble-wrapper:hover .bubble-text {
  color: var(--color-secondary);
  background-color: var(--color-shade);
}

.bubble-wrapper .bubble-id {
  z-index: 5;
  position: absolute;
  bottom: -2.5rem;
  color: var(--color-shade);
  font-style: italic;
}

.bubble-wrapper.selected {
  transform: scale(1.2);
  z-index: 10;
}

.bubble-wrapper.selected .bubble-text {
  color: var(--color-secondary);
  background-color: var(--color-accent);
}

.bubble-wrapper.selected .bubble-id {
  display: none;
}

.bubble-wrapper.shaded {
  opacity: 0.5;
  filter: grayscale(100%);
}

.bubble-wrapper.shaded:hover {
  opacity: 0.7;
  filter: grayscale(60%);
}

.bubble-wrapper .bubble-image {
  z-index: 10;
  border-radius: 50%;
  background-color: var(--color-secondary);
  background-size: cover;
  background-repeat: no-repeat;
  height: var(--size);
  width: var(--size);
  cursor: pointer;
}

</style>
