<template>
  <a class="button button-edit-mode" @click="toggleActive" :class="{active}">
    <b-icon pack="fas" icon="pencil-alt"></b-icon>
  </a>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  data() {
    return {
      active: false
    };
  },
  created: function() {
    this.active = Vue.$storage.get("edit-mode", false);
    this.dispatchStatus();
  },
  methods: {
    toggleActive() {
      const active = !this.active;
      console.log("edit mode now", (active ? "" : "in-") + "active");
      this.active = active;
      this.dispatchStatus();
    },
    dispatchStatus() {
      Vue.$storage.set("edit-mode", this.active);
      this.$emit("editMode", this.active);
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
  &.active {
    color: white;
    background: green;
  }
}
</style>
