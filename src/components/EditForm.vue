<template>
  <form action="#" @submit.prevent="close">
    <div class="modal-card" style="width: auto">
        <section class="modal-card-body" v-if="data">
          <b-input v-if="data.id" v-model="data.id" placeholder="Id" required />
          <b-input v-if="data.text" v-model="data.text" placeholder="Text" required />
          <b-input v-if="data.image" v-model="data.image" placeholder="Image url" required />
        </section>
        <footer class="modal-card-foot">
          <button class="button" type="reset" @click="cancel">Cancel</button>
          <button class="button is-primary" type="submit">Save</button>
        </footer>
    </div>
  </form>
</template>

<script lang="ts">
import Vue from "vue";

interface EditFormData {
  id?: string;
  text?: string;
  image?: string;
}

export default Vue.extend({
  props: {
    data: Object as () => EditFormData
  },
  data() {
    return {
      originalData: {} as EditFormData
    };
  },
  created: function() {
    this.originalData = this.copy(this.data);
  },
  methods: {
    copy(object: any) {
      return JSON.parse(JSON.stringify(object));
    },
    cancel() {
      console.log(`user just canceled edit`);
      if (this.originalData.id) {
        this.data.id = this.originalData.id;
      }
      if (this.originalData.text) {
        this.data.text = this.originalData.text;
      }
      if (this.originalData.image) {
        this.data.image = this.originalData.image;
      }
      this.close();
    },
    close() {
      console.log(`user finished edition`);
      this.$emit("close");
    }
  }
});
export { EditFormData };
</script>
