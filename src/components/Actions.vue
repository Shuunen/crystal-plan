<template>
  <div class="actions-wrapper">
    <div class="col start content is-medium">
      <div class="actions-list columns is-desktop is-mobile is-multiline">
        <div class="column" v-for="(data, index) in actions" :key="data.id + '-' + index" @click="clickAction(data)">
          <action :edit-mode="editMode" :data="data" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import Action, { ActionData } from './Action.vue'

@Component({
  components: { Action },
})
export default class HelloWorld extends Vue {
  @Prop() private actions!: ActionData[];
  @Prop() private editMode!: boolean;

  clickAction (action: ActionData) {
    if (this.editMode) return this.$emit('edit', action)
    this.$emit('select', action)
  }
}
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
