<template>
  <div class="bubble-wrapper col" :class="{ editable: editMode, selected: data.selected, shaded: data.shaded }">
    <div class="bubble-image" :style="backgroundStyle" />
    <div class="bubble-id" v-show="editMode">{{ data.id }}</div>
    <div class="bubble-text text ellipsis">{{ data.text }}</div>
  </div>
</template>


<script lang="ts">
import Vue from "vue";
import getSlug from 'speakingurl';

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

enum Sections {
  left = 'left',
  center = 'center',
  right = 'right'
}

class BubbleData {
  id?: string;
  text?: string;
  section?: Sections;
  image?: string;
  selected?: boolean = false;
  shaded?: boolean = false;
  constructor(data: BubbleData) {    
    this.text = data.text || "Default text";
    this.id = data.id || getSlug(this.text);
    this.section = data.section || Sections.left
    this.image = data.image || 'https://picsum.photos/80/80/?random'
  }
  /* Component methods can be declared as instance methods
  onClick(): void {
    window.alert(this.message);
  }*/
}

export { Sections, BubbleData }
</script>


<style lang="scss">
$size: 5rem;
.bubble-wrapper {
  position: relative;
  filter: grayscale(0);
  transition: color 0.4s, opacity 0.4s, filter 0.4s;
  margin: $size/4 0;
  &:hover {
    color: orangered;
  }
  &.selected {
    color: orangered;
  }
  &.shaded {
    opacity: 0.5;
    filter: grayscale(100%);
  }
}
.bubble-image {
  z-index: 10;
  border-radius: 50%;
  background-color: white;
  background-size: cover;
  height: $size;
  width: $size;
  cursor: pointer;
}
.bubble-id {
  z-index: 5;
  position: absolute;
  top: -$size/4;
  right: -$size/5;
  border: 3px solid currentColor;
  border-radius: 50%;
  width: $size/2;
  height: $size/2;
  line-height: $size/2.4;
  color: grey;
  background-color: white;
  transition: color 0.4s, opacity 0.4s;
}
.bubble-text {
  font-size: 110%;
  background-color: #ffffffe6;
  padding: 0 5px;
  position: absolute;
  bottom: -$size/3;
  max-width: $size * 1.5;
}
</style>
