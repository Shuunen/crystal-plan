<template>
  <div class="app">
    <global-events @keyup.f2="toggleEditMode" />
    <section class="section">
      <background />
      <div class="container chart has-text-centered">
        <h1 class="title">Crystal Plan.</h1>
        <edit-toggle @click.native="toggleEditMode" :editMode="editMode" />
        <chart v-if="bubbles.length" :bubbles="bubbles" @selectionUpdate="updateSelection" @bubblesUpdate="updateBubbles" :editMode="editMode" />
      </div>
    </section>
    <section class="section">
      <div class="container description">
        <description :content="description" @descriptionUpdate="updateDescription" :editMode="editMode" />
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Chance from "chance";
import GlobalEvents from "vue-global-events";

import Background from "./components/Background.vue";
import EditToggle from "./components/EditToggle.vue";
import Chart from "./components/Chart.vue";
import Description from "./components/Description.vue";
import { BubbleData, Sections } from "./components/Bubble.vue";

const chance = new Chance();

const DEFAULTS = {
  editMode: false,
  bubbles: [] as BubbleData[],
  bubblesPerSection: 4,
  bubblesCount: Object.keys(Sections).length,
  image: "https://picsum.photos/80/80/?image=",
  descriptions: {} as any,
  noSelectionDescription: "Please make a selection in the above bubbles.",
  noContentDescription:
    '<h1 class="title">Great title</h1><br>No content yet for this selection.'
};
// 3 sections x 4 bubbles = 12 by default
DEFAULTS.bubblesCount *= DEFAULTS.bubblesPerSection

declare module "vue/types/vue" {
  interface VueConstructor {
    $storage: any;
    pell: any;
  }
}

export default Vue.extend({
  name: "app",
  components: {
    Background,
    Chart,
    Description,
    EditToggle,
    GlobalEvents
  },
  data() {
    return {
      editMode: DEFAULTS.editMode,
      bubbles: DEFAULTS.bubbles,
      descriptions: DEFAULTS.descriptions,
      description: "",
      selection: "",
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
      this.descriptions = Vue.$storage.get(
        "descriptions",
        DEFAULTS.descriptions
      );
    },
    checkDataIntegrity() {
      if (this.bubbles.length <= 0) {
        this.addRandomBubbles();
      } else if (this.bubbles.length < DEFAULTS.bubblesCount){
        this.addMissingBubbles();
      }
    },
    addMissingBubbles(){
      console.log('missing bubbles detected')
      console.log('but this feature is not developed yet')
    },
    addRandomBubbles() {
      console.log("generating bubbles...");
      Object.keys(Sections).forEach(section => {
        for (let i = 0; i < DEFAULTS.bubblesPerSection; i++) {
          this.addRandomBubble(section as Sections);
        }
      });
      console.log("generated :", this.bubbles);
    },
    addRandomBubble(section: Sections) {
      this.bubbles.push(
        new BubbleData({
          text: chance.first(),
          image: DEFAULTS.image + chance.integer({ min: 0, max: 100 }),
          section: section
        })
      );
    },
    toggleEditMode() {
      this.editMode = !this.editMode;
      Vue.$storage.set("edit-mode", this.editMode);
    },
    updateBubbles(bubbles: BubbleData[]) {
      console.log("saving bubbles to storage...");
      Vue.$storage.set("bubbles", this.bubbles);
    },
    updateDescription(description: string) {
      console.log("saving updated description to storage...");
      this.description = description;
      this.descriptions[this.selection] = description;
      Vue.$storage.set("descriptions", this.descriptions);
    },
    updateSelection(selection: string) {
      console.log("detected selection :", selection);
      this.selection = selection;
      if (selection === "") {
        this.description = DEFAULTS.noSelectionDescription;
      } else if (this.descriptions.hasOwnProperty(selection)) {
        this.description = this.descriptions[selection];
      } else {
        this.description = DEFAULTS.noContentDescription;
      }
    }
  }
});
</script>

<style lang="scss">
@import url("https://use.fontawesome.com/releases/v5.2.0/css/all.css");
@import url("https://fonts.googleapis.com/css?family=Nunito|Roboto:500");
html,
body {
  height: 100%;
}
h1.title {
  border-bottom: 2px solid #bbb;
  display: inline-block;
}
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
