<template>
  <div class="chart">
    <div class="line">
      <div class="col">
          <bubble />
          <bubble />
          <bubble />
          <bubble />
      </div>
      <div class="col rays left">
          <div class="ray" v-for="i in 4" :key="i" />
      </div>
       <div class="col crystal">
          <div class="line">
            <bubble />
            <bubble />
          </div>
          <div class="line">
            <bubble />
            <bubble />
          </div>
          <div class="crystal-shape"></div>
      </div>
      <div class="col rays right">
          <div class="ray" v-for="i in 4" :key="i" />
      </div>
       <div class="col">
          <bubble />
          <bubble />
          <bubble />
          <bubble />
      </div>
    </div>
    <em>Edit is {{ editMode ? 'active' : 'inactive' }}</em>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Bubble from './Bubble.vue'

export default Vue.extend({
   props: {
    editMode: {
      type: Boolean,
      required: true,
    }
  },
  components: {
    Bubble,
  },
  data() {
    return {
      active: false
    }
  },
  created: function() {
    this.active = Vue.$storage.get('edit-mode', false)
  },
  methods: {
    toggleActive(){
      const active = !this.active
      console.log('edit mode now', (active ? '' : 'in-') + 'active')
      Vue.$storage.set('edit-mode', active)
      this.$emit('edit-mode', active)
      this.active = active
    },
  }
});
</script>

<style lang="scss">
$size: 12rem;
$thick: .2rem;
$color: orangered;
.col.crystal {
  width: $size;
  position: relative;
  justify-content: center;
  .line {
    position: relative;
    z-index: 10;
    & > div:first-child {
      margin-right: $size/5;
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
    margin-left: $size * .1;
    margin-right: $size * .2;
    & > div:nth-child(1) {
      transform: rotate($large-rotation) translate($large-x, $large-y) scaleX($large-scale);
    }
    & > div:nth-child(2) {
      transform: rotate($small-rotation) translate($small-x, $small-y) scaleX($small-scale);
    }
    & > div:nth-child(3) {
      transform: rotate(-$small-rotation) translate($small-x, -$small-y) scaleX($small-scale);
    }
    & > div:nth-child(4) {
      transform: rotate(-$large-rotation) translate($large-x, -$large-y) scaleX($large-scale);
    }
  }
  &.right {
    margin-right: $size * .1;
    margin-left: $size * .2;
    & > div:nth-child(1) {
      transform: rotate(-$large-rotation) translate(-$large-x, $large-y) scaleX($large-scale);
    }
    & > div:nth-child(2) {
      transform: rotate(-$small-rotation) translate($small-x, $small-y) scaleX($small-scale);
    }
    & > div:nth-child(3) {
      transform: rotate($small-rotation) translate($small-x, -$small-y) scaleX($small-scale);
    }
    & > div:nth-child(4) {
      transform: rotate($large-rotation) translate(-$large-x, -$large-y) scaleX($large-scale);
    }
  }
  .ray {
    display: block;
    height: $thick;
    width: $size * .8;
    background-color: $color;
  }
}
</style>
