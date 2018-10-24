<template>
  <div class="app">
    <global-events @keyup.f2="toggleEditMode" />
    <section class="section">
      <background />
      <div class="container chart has-text-centered">
        <app-header :content="header" @headerUpdate="updateHeader" :editMode="editMode" />
        <edit-toggle @click.native="toggleEditMode" :editMode="editMode" />
        <chart v-if="bubbles.length" :bubbles="bubbles" @selectionUpdate="updateSelection" @bubblesUpdate="updateBubbles" :editMode="editMode" />
      </div>
    </section>
    <section class="section description">
      <div class="container">
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
import { default as Header, HeaderData } from "./components/Header.vue";
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
    '<h1 class="title">Great title</h1><br>No content yet for this selection.',
  header: { text: "Crystal Plan." } as HeaderData
};
// 3 sections x 4 bubbles = 12 by default
DEFAULTS.bubblesCount *= DEFAULTS.bubblesPerSection;

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
    GlobalEvents,
    AppHeader: Header // header is reserved
  },
  data() {
    return {
      editMode: DEFAULTS.editMode,
      bubbles: DEFAULTS.bubbles,
      descriptions: DEFAULTS.descriptions,
      description: "",
      selection: "",
      showChart: false,
      header: DEFAULTS.header
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
      this.header = Vue.$storage.get("header", DEFAULTS.header);
      this.bubbles = Vue.$storage.get("bubbles", DEFAULTS.bubbles);
      this.descriptions = Vue.$storage.get(
        "descriptions",
        DEFAULTS.descriptions
      );
    },
    checkDataIntegrity() {
      if (this.bubbles.length <= 0) {
        this.addRandomBubbles();
      } else if (this.bubbles.length < DEFAULTS.bubblesCount) {
        this.addMissingBubbles();
      }
    },
    addMissingBubbles() {
      console.log("missing bubbles detected");
      console.log("but this feature is not developed yet");
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
    },
    updateHeader(header: HeaderData) {
      console.log("saving updated header to storage...", header);
      this.header = header;
      Vue.$storage.set("header", this.header);
    }
  }
});
</script>