<template>
  <div class="chart">
    <div class="line">
      <div class="col">
        <bubble
          v-for="(data, index) in bubbles.filter((b) => b.section === sections.left)"
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
            v-for="(data, index) in bubbles.filter((b) => b.section === sections.center)"
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
          v-for="(data, index) in bubbles.filter((b) => b.section === sections.right)"
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
import Bubble, { BubbleData, Sections } from './Bubble.vue'

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
  --size: 12rem;
  --thick: 0.2rem;
  --large-rotation: 39deg;
  --large-x: 3.4rem;
  --large-y: 5.2rem;
  --large-scale: 1.45;
  --small-rotation: 15deg;
  --small-x: 0rem;
  --small-y: 2.2rem;
  --small-scale: 1.1;
}
.col.crystal {
  width: var(--size);
  position: relative;
  justify-content: center;
  flex-shrink: 0;
}
.col.crystal .line {
  position: relative;
  z-index: 10;
  flex-wrap: wrap;
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
  z-index: 1;
  display: block;
  height: var(--size);
  width: var(--size);
  transform: rotate(45deg);
  border: var(--thick) solid currentColor;
  color: var(--color-accent);
  position: absolute;
  top: calc(50% - var(--size) / 2);
  left: calc(50% - var(--size) / 2);
}
.rays {
  justify-content: space-around;
}
.ray {
  display: block;
  height: var(--thick);
  width: calc(var(--size) * 0.8);
  background-color: var(--color-accent);
}
.rays.left {
  margin-left: calc(var(--size) * 0.1);
  margin-right: calc(var(--size) * 0.2);
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
  margin-right: calc(var(--size) * 0.1);
  margin-left: calc(var(--size) * 0.2);
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
