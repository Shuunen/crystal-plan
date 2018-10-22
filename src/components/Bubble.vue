<template>
  <div class="bubble" :class="{ editable: editMode }">
    <div class="id" v-show="editMode">{{ data.id }}</div>
    <div class="text">{{ data.text }}</div>
  </div>
</template>


<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
   props: {
    data: {
      type: Object,
      required: true
    },
    editMode: Boolean
  },
})

export interface BubbleData {
  id: number
  text: string
}
</script>


<style lang="scss">
$size: 5rem;
.bubble {
  border-radius: 50%;
  border: 3px solid currentColor;
  color: rebeccapurple;
  height: $size;
  width: $size;
  margin: $size/4 0;
  &.editable {
    cursor: pointer;
    &:hover {
      color: orangered;
    }
  }  
}
</style>
