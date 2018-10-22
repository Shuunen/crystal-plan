<template>
  <div class="chart">
    <div class="line">
      <div class="col">
          <bubble :data="data" :selected="data.selected" :editMode="editMode" @click.native="clickBubble(data)" v-for="data in bubblesLeft" :key="data.id" />
      </div>
      <div class="col rays left">
          <div class="ray" v-for="i in 4" :key="i" />
      </div>
       <div class="col crystal">
          <div class="line">
            <bubble :data="data" :selected="data.selected" :editMode="editMode" @click.native="clickBubble(data)" v-for="data in bubblesCenter" :key="data.id" />
          </div>
          <div class="crystal-shape"></div>
      </div>
      <div class="col rays right">
          <div class="ray" v-for="i in 4" :key="i" />
      </div>
       <div class="col">
          <bubble :data="data" :selected="data.selected" :editMode="editMode" @click.native="clickBubble(data)" v-for="data in bubblesRight" :key="data.id" />
      </div>
    </div>
    <em>Edit is {{ editMode ? 'active' : 'inactive' }}</em>
    <b-modal :active.sync="editFormOpened" has-modal-card>
      <BubbleForm v-bind="editFormData" @close="editFormOpened = false" />
    </b-modal>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { default as Bubble, BubbleData } from "./Bubble.vue";
import BubbleForm from "./BubbleForm.vue";
const selected = false
const shaded = false

export default Vue.extend({
  props: {
    editMode: {
      type: Boolean,
      required: true
    }
  },
  components: {
    Bubble,
    BubbleForm
  },
  data() {
    return {
      active: false,
      editFormOpened: false,
      editFormData: { data: {} },
      bubblesLeft: [
        { id: 11, selected, shaded, text: "One" },
        { id: 12, selected, shaded, text: "Two" },
        { id: 13, selected, shaded, text: "Three" },
        { id: 14, selected, shaded, text: "Four" }
      ],
      bubblesCenter: [
        { id: 21, selected, shaded, text: "Five" },
        { id: 22, selected, shaded, text: "Six" },
        { id: 23, selected, shaded, text: "Seven" },
        { id: 24, selected, shaded, text: "Height" }
      ],
      bubblesRight: [
        { id: 31, selected, shaded, text: "Nine" },
        { id: 32, selected, shaded, text: "Ten" },
        { id: 33, selected, shaded, text: "Eleven" },
        { id: 34, selected, shaded, text: "Twelve" }
      ]
    };
  },
  created: function() {
    this.active = Vue.$storage.get("edit-mode", false);
  },
  methods: {
    toggleActive() {
      const active = !this.active;
      console.log("edit mode now", (active ? "" : "in-") + "active");
      Vue.$storage.set("edit-mode", active);
      this.$emit("edit-mode", active);
      this.active = active;
    },
    clickBubble(data: BubbleData) {
      if (this.editMode) {
        console.log(`user wants to edit bubble ${data.id}`);
        this.editFormData.data = data;
        this.editFormOpened = true;
      } else {
        console.log(`user wants to select bubble ${data.id}`);
        this.selectOneBubble(data);
      }
    },
    findAssociatedBubbles(bubble: BubbleData): BubbleData[] {
      const group = bubble.id.toString().substr(0, 1);
      console.log("detected group :", group);
      if (group === "1") {
        return this.bubblesLeft;
      } else if (group === "2") {
        return this.bubblesCenter;
      } else if (group === "3") {
        return this.bubblesRight;
      } else {
        console.error("group id not handled");
        return [];
      }
    },
    selectOneBubble(bubble: BubbleData) {
      const focusMode = !!!bubble.selected
      this.findAssociatedBubbles(bubble).map(b => {
        if(focusMode){
          // only focus one bubble
          const goodOne = b.id === bubble.id
          b.selected = goodOne;
          b.shaded = !goodOne;
        } else {
          // reset values of all bubbles
          b.selected = false;
          b.shaded = false;
        }
      });
    }
  }
});
</script>

<style lang="scss">
$size: 12rem;
$thick: 0.2rem;
$color: orangered;
.col.crystal {
  width: $size;
  position: relative;
  justify-content: center;
  .line {
    position: relative;
    z-index: 10;
    flex-wrap: wrap;
    & > div:nth-child(1) {
      margin: 0 1rem 0 -1rem;
    }
    & > div:nth-child(2) {
      margin: 0 -1rem 0 1rem;
    }
    & > div:nth-child(3) {
      margin: 1rem 1rem 0 -1rem;
    }
    & > div:nth-child(4) {
      margin: 1rem -1rem 0 1rem;
    }
  }
  .crystal-shape {
    z-index: 1;
    display: block;
    height: $size;
    width: $size;
    transform: rotate(45deg);
    border: $thick solid currentColor;
    color: $color;
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
    background-color: $color;
  }
}
</style>
