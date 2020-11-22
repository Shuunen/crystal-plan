<template>
  <div class="chart">
    <div class="line">
      <div class="col">
        <bubble
          v-for="(data, index) in bubbles.filter(b => b.section === sections.left)"
          :key="data.id + index"
          :data="data"
          :selected="data.selected"
          :edit-mode="editMode"
          @click.native="clickBubble(data)"
        />
      </div>
      <div class="col rays left">
        <div v-for="i in [1, 2, 3, 4]" :key="i" class="ray" />
      </div>
      <div class="col crystal">
        <div class="line">
          <bubble
            v-for="(data, index) in bubbles.filter(b => b.section === sections.center)"
            :key="data.id + index"
            :data="data"
            :selected="data.selected"
            :edit-mode="editMode"
            @click.native="clickBubble(data)"
          />
        </div>
        <div class="crystal-shape" />
      </div>
      <div class="col rays right">
        <div v-for="i in [5, 6, 7, 8]" :key="i" class="ray" />
      </div>
      <div class="col">
        <bubble
          v-for="(data, index) in bubbles.filter(b => b.section === sections.right)"
          :key="data.id + index"
          :data="data"
          :selected="data.selected"
          :edit-mode="editMode"
          @click.native="clickBubble(data)"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import Bubble, { BubbleData, Sections } from './bubble.vue'

@Component({ components: { Bubble } })
export default class Chart extends Vue {
  @Prop() private bubbles!: BubbleData[];
  @Prop() private editMode!: boolean;

  sections = Sections;

  clickBubble (bubble: BubbleData) {
    if (this.editMode) {
      console.log(`user wants to edit bubble ${bubble.id}`)
      this.$emit('edit', bubble)
    } else {
      console.log(`user wants to select bubble ${bubble.id}`)
      this.$emit('select', bubble)
    }
  }
  /*
    selectOneBubble (bubble: BubbleData) {
      const focusMode = !bubble.selected
      this.bubbles.filter(b => b.section === bubble.section).map(b => {
        if (focusMode) {
          // only focus one bubble
          const goodOne = b.id === bubble.id
          b.selected = goodOne
          b.shaded = !goodOne
        } else {
          // reset values of all bubbles
          b.selected = false
          b.shaded = false
        }
      })
    },
    */
}
</script>

<style>
.chart {
  --large-rotation: 39deg;
  --large-scale: 1.45;
  --large-x: 3.4rem;
  --large-y: 5.2rem;
  --size: 12rem;
  --small-rotation: 15deg;
  --small-scale: 1.1;
  --small-x: 0rem;
  --small-y: 2.2rem;
  --thick: .2rem;
}
.col.crystal {
  flex-shrink: 0;
  justify-content: center;
  position: relative;
  width: var(--size);
}
.col.crystal .line {
  flex-wrap: wrap;
  position: relative;
  z-index: 10;
}
.col.crystal .line > div:nth-child(1) {
  margin: 0 1rem 1rem -1rem;
}
.col.crystal .line > div:nth-child(2) {
  margin: 0 -1rem 1rem 1rem;
}
.col.crystal .line > div:nth-child(3) {
  margin: 1.5rem 1rem 0 -1rem;
}
.col.crystal .line > div:nth-child(4) {
  margin: 1.5rem -1rem 0 1rem;
}
.col.crystal .crystal-shape {
  border: var(--thick) solid currentColor;
  color: var(--color-accent);
  display: block;
  height: var(--size);
  left: calc(50% - var(--size) / 2);
  position: absolute;
  top: calc(50% - var(--size) / 2);
  transform: rotate(45deg);
  width: var(--size);
  z-index: 1;
}
.rays {
  justify-content: space-around;
}
.ray {
  background-color: var(--color-accent);
  display: block;
  height: var(--thick);
  width: calc(var(--size) * .8);
}
.rays.left {
  margin-left: calc(var(--size) * .1);
  margin-right: calc(var(--size) * .2);
}
.rays.left > div:nth-child(1) {
  transform: rotate(var(--large-rotation)) translate(var(--large-x), var(--large-y)) scaleX(var(--large-scale));
}
.rays.left > div:nth-child(2) {
  transform: rotate(var(--small-rotation)) translate(var(--small-x), var(--small-y)) scaleX(var(--small-scale));
}
.rays.left > div:nth-child(3) {
  transform: rotate(calc(-1 * var(--small-rotation))) translate(var(--small-x), calc(-1 * var(--small-y))) scaleX(var(--small-scale));
}
.rays.left > div:nth-child(4) {
  transform: rotate(calc(-1 * var(--large-rotation))) translate(var(--large-x), calc(-1 * var(--large-y))) scaleX(var(--large-scale));
}
.rays.right {
  margin-left: calc(var(--size) * .2);
  margin-right: calc(var(--size) * .1);
}
.rays.right div:nth-child(1) {
  transform: rotate(calc(-1 * var(--large-rotation))) translate(calc(-1 * var(--large-x)), var(--large-y)) scaleX(var(--large-scale));
}
.rays.right > div:nth-child(2) {
  transform: rotate(calc(-1 * var(--small-rotation))) translate(var(--small-x), var(--small-y)) scaleX(var(--small-scale));
}
.rays.right > div:nth-child(3) {
  transform: rotate(var(--small-rotation)) translate(var(--small-x), calc(-1 * var(--small-y))) scaleX(var(--small-scale));
}
.rays.right > div:nth-child(4) {
  transform: rotate(var(--large-rotation)) translate(calc(-1 * var(--large-x)), calc(-1 * var(--large-y))) scaleX(var(--large-scale));
}
</style>
