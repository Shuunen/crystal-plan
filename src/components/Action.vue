<template>
  <div class="action line start" :class="{ 'button-mode': data.button }">
    <div class="image" v-if="data.image">
      <img :src="data.image" alt="action image" />
    </div>
    <div class="icon" v-if="data.icon">
      <b-icon pack="far" :icon="data.icon" />
    </div>
    <div class="text ellipsis" v-if="data.text">{{ data.text }}</div>
    <div class="arrow">
      <b-icon pack="far" :icon="editMode ? 'edit' : 'arrow-alt-circle-right'" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Types } from '@/App.vue'
import { slugify } from 'shuutils'

export interface ActionData {
  button?: boolean;
  icon?: string;
  id?: string;
  image?: string;
  text: string;
  type?: string;
}

@Component
export default class Action extends Vue {
  @Prop() private data!: ActionData;
  @Prop() private editMode!: boolean;

  created () {
    if (!this.data.type) {
      this.data.type = Types.action
    }
    if (!this.data.id) {
      this.data.id = slugify(this.data.text)
    }
  }
}
</script>

<style>
.action {
  min-width: 22vw;
  padding: 0.7rem 1rem;
  color: var(--color-shade-alt);
  border: 2px solid currentColor;
  align-items: center;
  transition: color 0.4s;
  cursor: pointer;
}
.action .image,
.action .icon,
.action .text {
  margin-right: 0.8rem;
}
.action .image,
.action .icon {
  width: 2rem;
}
.action .text {
  color: var(--color-primary);
  margin-bottom: 0;
}
.action .arrow {
  margin-top: 0.2rem;
  margin-left: auto;
  transition: color 0.2s, transform 0.2s;
}
.action:hover,
.action:hover .arrow {
  color: var(--color-accent);
}
.action:hover .arrow {
  transform: scale(1.2);
}
.action.button-mode {
  min-width: inherit;
  margin-top: 1.5rem;
}
.action.button-mode .arrow {
  display: none;
}
</style>
