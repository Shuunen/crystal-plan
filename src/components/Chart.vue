<template>
  <div class="chart">
    <div class="line">
      <div class="col">
          <bubble :data="data" :selected="data.selected" :editMode="editMode" @click.native="clickBubble(data)" v-for="data in bubbles.filter(b => b.section === Sections.left)" :key="data.id" />
      </div>
      <div class="col rays left">
          <div class="ray" v-for="i in 4" :key="i" />
      </div>
       <div class="col crystal">
          <div class="line">
            <bubble :data="data" :selected="data.selected" :editMode="editMode" @click.native="clickBubble(data)" v-for="data in bubbles.filter(b => b.section === Sections.center)" :key="data.id" />
          </div>
          <div class="crystal-shape"></div>
      </div>
      <div class="col rays right">
          <div class="ray" v-for="i in 4" :key="i" />
      </div>
       <div class="col">
          <bubble :data="data" :selected="data.selected" :editMode="editMode" @click.native="clickBubble(data)" v-for="data in bubbles.filter(b => b.section === Sections.right)" :key="data.id" />
      </div>
    </div>
    <b-modal :active.sync="editFormOpened" has-modal-card>
      <BubbleForm v-bind="editFormData" @close="closeForm" />
    </b-modal>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Bubble, { BubbleData, Sections } from './Bubble.vue'
import BubbleForm from './BubbleForm.vue'

export default Vue.extend({
  props: {
    editMode: {
      type: Boolean,
      required: true
    },
    bubbles: {
      type: Array as () => BubbleData[],
      required: true
    }
  },
  components: {
    Bubble,
    BubbleForm
  },
  data () {
    return {
      Sections,
      editFormOpened: false,
      editFormData: { data: {} }
    }
  },
  methods: {
    clickBubble (data: BubbleData) {
      if (this.editMode) {
        console.log(`user wants to edit bubble ${data.id}`)
        this.editFormData.data = data
        this.editFormOpened = true
      } else {
        console.log(`user wants to select bubble ${data.id}`)
        this.selectOneBubble(data)
      }
    },
    closeForm (dataUpdated: boolean) {
      if (dataUpdated) {
        // console.log('emitting bubblesUpdate')
        this.$emit('bubblesUpdate', this.bubbles)
        this.emitSelection()
      }
      this.editFormOpened = false
    },
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
      this.emitSelection()
    },
    emitSelection () {
      this.$emit('selectionUpdate')
    }
  }
})
</script>

<style lang="scss">
@import '../assets/shared';
$size: 12rem;
$thick: 0.2rem;
.col.crystal {
  width: $size;
  position: relative;
  justify-content: center;
  flex-shrink: 0;
  .line {
    position: relative;
    z-index: 10;
    flex-wrap: wrap;
    & > div:nth-child(1) {
      margin: 0 1rem 1rem -1rem;
    }
    & > div:nth-child(2) {
      margin: 0 -1rem 1rem 1rem;
    }
    & > div:nth-child(3) {
      margin: 1.5rem 1rem 0 -1rem;
    }
    & > div:nth-child(4) {
      margin: 1.5rem -1rem 0 1rem;
    }
  }
  .crystal-shape {
    z-index: 1;
    display: block;
    height: $size;
    width: $size;
    transform: rotate(45deg);
    border: $thick solid currentColor;
    color: $color-accent;
    position: absolute;
    top: calc(50% - #{$size/2});
    left: calc(50% - #{$size/2});
  }
}
.rays {
  justify-content: space-around;
  $large-rotation: 39deg;
  $large-x: 3.4rem;
  $large-y: 5.2rem;
  $large-scale: 1.45;
  $small-rotation: 15deg;
  $small-x: 0rem;
  $small-y: 2.2rem;
  $small-scale: 1.1;
  &.left {
    margin-left: $size * 0.1;
    margin-right: $size * 0.2;
    & > div:nth-child(1) {
      transform: rotate($large-rotation) translate($large-x, $large-y)
        scaleX($large-scale);
    }
    & > div:nth-child(2) {
      transform: rotate($small-rotation) translate($small-x, $small-y)
        scaleX($small-scale);
    }
    & > div:nth-child(3) {
      transform: rotate(-$small-rotation) translate($small-x, -$small-y)
        scaleX($small-scale);
    }
    & > div:nth-child(4) {
      transform: rotate(-$large-rotation) translate($large-x, -$large-y)
        scaleX($large-scale);
    }
  }
  &.right {
    margin-right: $size * 0.1;
    margin-left: $size * 0.2;
    & > div:nth-child(1) {
      transform: rotate(-$large-rotation) translate(-$large-x, $large-y)
        scaleX($large-scale);
    }
    & > div:nth-child(2) {
      transform: rotate(-$small-rotation) translate($small-x, $small-y)
        scaleX($small-scale);
    }
    & > div:nth-child(3) {
      transform: rotate($small-rotation) translate($small-x, -$small-y)
        scaleX($small-scale);
    }
    & > div:nth-child(4) {
      transform: rotate($large-rotation) translate(-$large-x, -$large-y)
        scaleX($large-scale);
    }
  }
  .ray {
    display: block;
    height: $thick;
    width: $size * 0.8;
    background-color: $color-accent;
  }
}
</style>
