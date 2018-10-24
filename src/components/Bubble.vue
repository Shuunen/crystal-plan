<template>
  <div class="bubble-wrapper col" :class="{ editable: editMode, selected: data.selected, shaded: data.shaded }">
    <div class="bubble-image" :style="backgroundStyle" />
    <div class="bubble-id" v-show="editMode">{{ data.id }}</div>
    <div class="bubble-text text ellipsis">{{ data.text }}</div>
  </div>
</template>


<script lang="ts">
import Vue from "vue";
import getSlug from "speakingurl";

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
  left = "left",
  center = "center",
  right = "right"
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
    this.section = data.section || Sections.left;
    this.image = data.image || "https://picsum.photos/80/80/?random";
  }
  /* Component methods can be declared as instance methods
  onClick(): void {
    window.alert(this.message);
  }*/
}

export { Sections, BubbleData };
</script>


<style lang="scss">
@import "../assets/shared";
$size: 5rem;
.bubble-wrapper {
  position: relative;
  filter: grayscale(0);
  transition: all 0.4s;
  margin: $size/4 0;
  transform: scale(1);
  &:hover .bubble-text {
    color: $color-secondary;
    background-color: $color-shade;
  }
  &.selected {
    transform: scale(1.2);
    .bubble-text {
      color: $color-secondary;
      background-color: $color-accent;
    }
    .bubble-id {
      display: none;
    }
  }
  &.shaded {
    opacity: 0.5;
    filter: grayscale(100%);
    &:hover {
      opacity: 0.7;
      filter: grayscale(60%);
    }
  }
}
.bubble-image {
  z-index: 10;
  border-radius: 50%;
  background-color: $color-secondary;
  background-size: cover;
  height: $size;
  width: $size;
  cursor: pointer;
}
.bubble-id {
  z-index: 5;
  position: absolute;
  bottom: -2.5rem;
  color: $color-shade;
  font-style: italic;
}
.bubble-text {
  font-size: 110%;
  background-color: $color-secondary;
  padding: 0 5px;
  position: absolute;
  bottom: -$size/3;
  max-width: $size * 1.6;
  transition: all 0.4s;
}
</style>
