<template>
  <div class="header-wrapper" :class="{ editable: editMode }">
    <h1 v-show="content.text && content.text.length" class="header-text">{{ content.text }}</h1>
    <div v-show="content.image && content.image.length" class="header-image" :style="backgroundStyle" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";

interface HeaderData {
  text?: string;
  image?: string;
}

export default Vue.extend({
  props: {
    content: {
      type: Object as () => HeaderData,
      required: true
    },
    editMode: Boolean
  },
  data() {
    return {
      backgroundStyle: {}
    };
  },
  created() {
    if (this.content.image && this.content.image.length) {
      this.backgroundStyle = {
        backgroundImage: "url(" + this.content.image + ")"
      };
    }
  }
});

export { HeaderData };
</script>

<style lang="scss">
@import "../assets/shared";
.header-wrapper {
  &.editable {
    cursor: pointer;
    &:hover {
      .header-text {
        background-color: $color-shade;
        color: $color-secondary;
      }
    }
  }
}
</style>
