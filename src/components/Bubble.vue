<template>
  <div class="bubble-wrapper col" :class="{ editable: editMode, selected: data.selected, shaded: data.shaded }">
    <div class="bubble-image" />
    <div class="bubble-id" v-show="editMode">{{ data.id }}</div>
    <div class="bubble-text">{{ data.text }}</div>
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
  }
});

export interface BubbleData {
  id: number;
  text: string;
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
    opacity: .5;
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
  transition: color 0.4s, opacity 0.4s;
}
.bubble-id {
  z-index: 5;
  position: absolute;
  top: -1.15rem;
  top: -$size/4;
  right: -0.8rem;
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
  margin-bottom: $size/4;
  background-color: #ffffffe6;
  padding: 0 5px;
}
</style>
