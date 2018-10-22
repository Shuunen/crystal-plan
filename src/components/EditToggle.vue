<template>
  <a class="button button-edit-mode" :class="{active: editMode}">
    <b-icon pack="fas" icon="pencil-alt"></b-icon>
  </a>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  props: {
    editMode: {
      type: Boolean,
      required: true
    }
  }
});
</script>

<style lang="scss">
a.button-edit-mode {
  position: fixed;
  top: 2rem;
  right: 2rem;
  border-radius: 50%;
  outline: none;
  padding: 20px 15px;
  display: flex;
  justify-content: center;
  transform: scale(1) rotate(0deg);
  transition: color 0.3s, transform 0.3s;
  &.active {
    color: white;
    background: green;
    transform: scale(1.2) rotate(20deg);
  }
}
</style>
