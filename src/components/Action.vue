<template>
  <div class="action line start" :class="{ 'button-mode': data.button }">
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
import getSlug from 'speakingurl'
import { Types } from './../App.vue'

interface ActionData {
  id?: string;
  text: string;
  image?: string;
  icon?: string;
  button?: boolean;
  type?: string;
}

export default Vue.extend({
  props: {
    data: {
      type: Object as () => ActionData,
      required: true
    },
    editMode: Boolean
  },
  created () {
    if (!this.data.type) {
      this.data.type = Types.action
    }
    if (!this.data.id) {
      this.data.id = getSlug(this.data.text)
    }
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
  &.button-mode {
    min-width: inherit;
    margin-top: 1.5rem;
    .arrow {
      display: none;
    }
  }
}
</style>
