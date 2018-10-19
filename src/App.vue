<template>
  <section class="section">
    <div class="container has-text-centered">
      <h1 class="title">Crystal Plan</h1>
      <edit-toggle v-on:editMode="setEditMode" />
      <chart :editMode="editMode" />
    </div>
  </section>
</template>

<script lang="ts">
import Vue from 'vue';
import HelloWorld from './components/HelloWorld.vue';
import EditToggle from './components/EditToggle.vue';
import Chart from './components/Chart.vue';

export default Vue.extend({
  name: 'app',
  components: {
    Chart,
    EditToggle,
  },
  data() {
    return {
      editMode: false
    }
  },
  methods: {
    setEditMode(value:boolean){
      this.editMode = value
    },
  }
});
</script>

<style lang="scss">
@import url('https://use.fontawesome.com/releases/v5.2.0/css/all.css');
.line {
  display: flex;
  justify-content: center;
  &.start {
    justify-content: flex-start;
  }
  &.end {
    justify-content: flex-end;
  }
}
.col {
  display: flex;
  flex-direction: column;
  align-items: center;
  &.start {
    align-items: flex-start;
  }
  &.end {
    align-items: flex-end;
  }
}
</style>
