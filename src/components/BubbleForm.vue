<template>
  <form action="#">
    <div class="modal-card" style="width: auto">
        <section class="modal-card-body">
          <b-input v-model="data.text" placeholder="Text" required />
        </section>
        <footer class="modal-card-foot">
          <button class="button" type="reset" @click="cancelEdit">Cancel</button>
          <button class="button is-primary" type="submit" @click="updateData">Save</button>
        </footer>
    </div>
  </form>
</template>

<script lang="ts">
import Vue from "vue";
import { BubbleData } from "./Bubble.vue";

export default Vue.extend({
  props: {
    data: Object
  },
  data() {
    return {
      originalData: <BubbleData>{}
    };
  },
  created: function() {
    this.originalData = Object.assign({}, this.data);
  },
  methods: {
    cancelEdit() {
      console.log(`user just canceled bubble edit`);
      this.data.text = this.originalData.text;
      this.$emit("close");
    },
    updateData() {
      console.log(`user updated bubble with new data`);
      this.$emit("close");
    }
  }
});
</script>
