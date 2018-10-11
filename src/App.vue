<template>
  <section class="section">
    <div class="container has-text-centered">
      <h1 class="title">Crystal Plan</h1>
      <hello-world />
    </div>
  </section>
</template>

<script lang="ts">
import Vue from 'vue';
import HelloWorld from './components/HelloWorld.vue';

export default Vue.extend({
  name: 'app',
  components: {
    HelloWorld
  }
});
</script>

<style lang="scss">
.line {
  display: flex;
  justify-content: center;
}
.col {
  display: flex;
  flex-direction: column;
}
</style>
