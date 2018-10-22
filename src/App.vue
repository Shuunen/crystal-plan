<template>
  <section class="section">
    <div class="container has-text-centered">
      <h1 class="title">Crystal Plan</h1>
      <edit-toggle @click.native="toggleEditMode" :editMode="editMode" />
      <chart :bubbles="bubbles" @bubblesUpdate="updateBubbles" :editMode="editMode" />
    </div>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import HelloWorld from "./components/HelloWorld.vue";
import EditToggle from "./components/EditToggle.vue";
import Chart from "./components/Chart.vue";
import { BubbleData } from "./components/Bubble.vue";

const selected = false;
const shaded = false;
const DEFAULTS = {
  editMode: false,
  bubbles: {
    left: [
      { id: 11, selected, shaded, text: "One" },
      { id: 12, selected, shaded, text: "Two" },
      { id: 13, selected, shaded, text: "Three" },
      { id: 14, selected, shaded, text: "Four" }
    ],
    center: [
      { id: 21, selected, shaded, text: "Five" },
      { id: 22, selected, shaded, text: "Six" },
      { id: 23, selected, shaded, text: "Seven" },
      { id: 24, selected, shaded, text: "Height" }
    ],
    right: [
      { id: 31, selected, shaded, text: "Nine" },
      { id: 32, selected, shaded, text: "Ten" },
      { id: 33, selected, shaded, text: "Eleven" },
      { id: 34, selected, shaded, text: "Twelve" }
    ]
  }
};

declare module 'vue/types/vue' {	
  interface VueConstructor {	
    $storage: any	
  }	
}

interface Bubbles {
  left: BubbleData[];
  center: BubbleData[];
  right: BubbleData[];
}

export default Vue.extend({
  name: "app",
  components: {
    Chart,
    EditToggle
  },
  data() {
    return {
      editMode: DEFAULTS.editMode,
      bubbles: DEFAULTS.bubbles
    };
  },
  created() {
    this.restoreState();
  },
  methods: {
    restoreState() {
      this.editMode = Vue.$storage.get("edit-mode", DEFAULTS.editMode);
      this.bubbles = Vue.$storage.get("bubbles", DEFAULTS.bubbles);
    },
    toggleEditMode() {
      this.editMode = !this.editMode;
      Vue.$storage.set("edit-mode", this.editMode);
    },
    updateBubbles(bubbles: Bubbles) {
      console.log("saving bubbles to storage...");
      Vue.$storage.set("bubbles", this.bubbles);
    }
  }
});
</script>

<style lang="scss">
@import url("https://use.fontawesome.com/releases/v5.2.0/css/all.css");
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
.ellipsis {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>
