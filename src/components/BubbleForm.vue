<template>
  <form action="#">
    <div class="modal-card" style="width: auto">
        <section class="modal-card-body">
          <b-field label="Text">
            <b-input :value="data.text" placeholder="Text" required />
          </b-field>
        </section>
        <footer class="modal-card-foot">
          <button class="button" type="button" @click="$parent.close()">Close</button>
          <button class="button is-primary" @click="updateData">Save</button>
        </footer>
    </div>
  </form>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  props: {
    data: Object
  },
  methods: {
   updateData() {
      console.log(`user wants to update bubble ${this.data.id}`)
      this.$emit('updateData', this.data)
    }
  }
});
</script>
