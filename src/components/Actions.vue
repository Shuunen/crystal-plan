<template>
  <div class="actions-wrapper">
    <div class="col start content is-medium">
      <div class="actions-list columns is-desktop is-mobile is-multiline">
        <div class="column" v-for="data in actions" :key="data.id" @click="clickAction(data)">
          <action :edit-mode="editMode" :data="data" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Action, { ActionData } from './Action.vue'

export default Vue.extend({
  props: {
    actions: {
      type: Array as () => ActionData[],
      required: true
    },
    editMode: Boolean
  },
  components: {
    Action
  },
  methods: {
    clickAction (action: ActionData) {
      if (this.editMode) {
        this.$emit('edit', action)
      } else {
        this.$emit('select', action)
      }
    }
  }
})
</script>

<style>
.actions-wrapper h2.title {
  border-bottom: 0.2rem solid var(--color-accent);
  display: inline-block;
  margin-bottom: 2rem;
}
.actions-wrapper > .columns {
  flex-wrap: wrap;
}
.actions-wrapper .background.fade-leave-active.fade-leave-to {
  display: none;
}
.actions-list {
  padding-top: 0.6rem;
}
</style>
