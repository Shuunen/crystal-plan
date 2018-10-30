<template>
  <div class="toggle-wrapper">
    <b-tooltip label="Shortcut : F2" position="is-left">
      <a class="button button-edit-mode" :class="{active: editMode}">
        <b-icon pack="far" icon="edit"></b-icon>
      </a>
    </b-tooltip>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    editMode: {
      type: Boolean,
      required: true
    }
  }
})
</script>

<style lang="scss">
@import '../assets/shared';
.toggle-wrapper {
  position: fixed;
  top: 2rem;
  right: 2rem;
  z-index: 20;
  .tooltip.is-primary:after {
    background: $color-shade;
  }
  .tooltip.is-left.is-primary:before {
    border-left: 0;
  }
}
a.button-edit-mode {
  border-radius: 50%;
  outline: none;
  padding: 20px 15px;
  display: flex;
  justify-content: center;
  transition: color 0.3s, transform 0.3s;
  color: $color-shade;
  background-color: transparent;
  border: 0;
  &.active {
    color: $color-secondary;
    background: $color-accent;
    transform: scale(1.2);
  }
}
</style>
