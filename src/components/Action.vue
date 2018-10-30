<template>
  <div class="action line start" :class="{ back: data.back }">
    <div class="image" v-if="data.image">
      <img :src="data.image" alt="action image">
    </div>
    <div class="icon" v-if="data.icon">
      <b-icon pack="far" :icon="data.icon" />
    </div>
    <div class="text ellipsis" v-if="data.text">
      {{ data.text }}
    </div>
    <div class="arrow">
      <b-icon pack="far" :icon="editMode ? 'edit' : 'arrow-alt-circle-right'" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

interface ActionData {
  id: string;
  text: string;
  image?: string;
  icon?: string;
  back?: boolean;
}

export default Vue.extend({
  props: {
    data: {
      type: Object as () => ActionData,
      required: true
    },
    editMode: Boolean
  }
})

export { ActionData }
</script>

<style lang="scss">
@import "../assets/shared";
.action {
  min-width: 22vw;
  padding: 0.7rem 1rem;
  color: $color-shade-alt;
  border: 2px solid currentColor;
  align-items: center;
  transition: color 0.4s;
  cursor: pointer;
  .image,
  .icon,
  .text {
    margin-right: 0.8rem;
  }
  .image,
  .icon {
    width: 2rem;
  }
  .text {
    color: $color-primary;
    margin-bottom: 0;
  }
  .arrow {
    margin-top: .2rem;
    margin-left: auto;
    transition: color 0.2s, transform .2s;
  }
  &:hover {
    &,
    .arrow {
      color: $color-accent;
    }
    .arrow {
      transform: scale(1.2);
    }
  }
  &.back {
    min-width: inherit;
    .arrow {
      display: none;
    }
  }
}
</style>
