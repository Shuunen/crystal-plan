<template>
  <div class="bubble-wrapper col" :class="{ editable: editMode, selected: data.selected, shaded: data.shaded }">
    <div class="bubble-image" :style="backgroundStyle" />
    <div class="bubble-id" v-show="editMode">{{ data.id }}</div>
    <div class="bubble-text ellipsis">{{ data.text }}</div>
  </div>
</template>


<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  props: {
    data: {
      type: Object,
      required: true
    },
    editMode: Boolean
  },
  computed: {
    image() {
      let path = "https://image.flaticon.com/icons/svg/234/234618.svg";
      if (!this.data) {
        console.warn("data not available, using default image...");
        return path;
      }
      if (this.data.image && this.data.image.length) {
        path = this.data.image;
      } else {
        console.warn("image not available, using default one...");
      }
      return path;
    }
  },
  data() {
    return {
      backgroundStyle: {}
    };
  },
  created() {
    this.backgroundStyle = { backgroundImage: "url(" + this.image + ")" };
  }
});

export interface BubbleData {
  id: number;
  text: string;
  image: string;
  selected: boolean;
  shaded: boolean;
}
</script>


<style lang="scss">
$size: 5rem;
$thick: 0.2rem;
.bubble-wrapper {
  position: relative;
  color: rebeccapurple;
  filter: grayscale(0);
  transition: color 0.4s, opacity 0.4s, filter 0.4s;
  margin: $size/4 0;
  &:hover {
    color: orangered;
    & + .bubble-id {
      color: forestgreen;
      opacity: 1;
    }
  }
  &.selected {
    color: forestgreen;
  }
  &.shaded {
    opacity: 0.5;
    filter: grayscale(100%);
  }
}
.bubble-image {
  z-index: 10;
  border-radius: 50%;
  border: $thick solid currentColor;
  background-color: white;
  height: $size;
  width: $size;
  cursor: pointer;
}
.bubble-id {
  z-index: 5;
  position: absolute;
  top: -$size/4;
  right: -$size/5;
  border: $thick * 0.6 solid;
  border-radius: 50%;
  width: $size/2;
  height: $size/2;
  line-height: $size/2.4;
  color: grey;
  opacity: 0.6;
  background-color: white;
  transition: color 0.4s, opacity 0.4s;
}
.bubble-text {
  font-weight: bold;
  background-color: #ffffffe6;
  padding: 0 5px;
  position: absolute;
  bottom: -$size/3.5;
  max-width: $size * 1.5;
}
</style>
