<template>
  <div class="toggle-wrapper">
    <b-tooltip label="Shortcut : F2" position="is-left">
      <a class="button button-edit-mode" :class="{ active: editMode }">
        <b-icon pack="far" icon="edit" />
      </a>
    </b-tooltip>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class EditToggle extends Vue {
  @Prop() private editMode!: boolean
}
</script>

<style>
.toggle-wrapper {
  position: fixed;
  top: 2rem;
  right: 2rem;
  z-index: 20;
}

.toggle-wrapper .tooltip.is-primary::after {
  background: var(--color-shade);
}

.toggle-wrapper .tooltip.is-left.is-primary::before {
  border-left: 0;
}

a.button-edit-mode {
  border-radius: 50%;
  outline: none;
  height: 2rem;
  width: 2rem;
  display: flex;
  justify-content: center;
  transition: color 0.3s, transform 0.3s;
  color: var(--color-shade);
  background-color: transparent;
  border: 0;
}

a.button-edit-mode.active {
  color: var(--color-secondary);
  background: var(--color-accent);
  transform: scale(1.2);
}
</style>
