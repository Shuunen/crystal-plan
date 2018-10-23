<template>
  <section class="section">
    <div class="container has-text-centered">
      <h1 class="title">Crystal Plan</h1>
      <edit-toggle @click.native="toggleEditMode" :editMode="editMode" />
      <chart v-if="bubbles.length" :bubbles="bubbles" @bubblesUpdate="updateBubbles" :editMode="editMode" />
    </div>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Chance from "chance";
import HelloWorld from "./components/HelloWorld.vue";
import EditToggle from "./components/EditToggle.vue";
import Chart from "./components/Chart.vue";
import { BubbleData, Sections } from "./components/Bubble.vue";
const chance = new Chance();

const DEFAULTS = {
  editMode: false,
  bubbles: [] as BubbleData[],
  bubblesPerSection: 4
};

declare module "vue/types/vue" {
  interface VueConstructor {
    $storage: any;
  }
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
      bubbles: DEFAULTS.bubbles,
      showChart: false
    };
  },
  created() {
    this.restoreState();
    this.checkDataIntegrity();
    this.showChart = true;
  },
  methods: {
    restoreState() {
      this.editMode = Vue.$storage.get("edit-mode", DEFAULTS.editMode);
      this.bubbles = Vue.$storage.get("bubbles", DEFAULTS.bubbles);
    },
    checkDataIntegrity() {
      if (this.bubbles.length <= 0) {
        console.log("generating bubbles...");
        let imageId = 42;
        Object.keys(Sections).forEach(section => {
          for (let i = 0; i < DEFAULTS.bubblesPerSection; i++) {
            this.bubbles.push(
              new BubbleData({
                text: chance.first(),
                image: "https://picsum.photos/80/80/?image=" + imageId,
                section: section as Sections
              })
            );
            // this let us shows different images from picsum
            imageId++;
          }
        });
        console.log("generated :", this.bubbles);
      }
    },
    toggleEditMode() {
      this.editMode = !this.editMode;
      Vue.$storage.set("edit-mode", this.editMode);
    },
    updateBubbles(bubbles: BubbleData[]) {
      console.log("saving bubbles to storage...");
      Vue.$storage.set("bubbles", this.bubbles);
    }
  }
});
</script>

<style lang="scss">
@import url("https://use.fontawesome.com/releases/v5.2.0/css/all.css");
@import url("https://fonts.googleapis.com/css?family=Nunito|Roboto:500");
body {
  .title {
    font-family: "Nunito", sans-serif;
    font-weight: 400;
  }
  .text {
    font-family: "Roboto", sans-serif;
    font-weight: 500;
  }
}
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
