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
import getSlug from "speakingurl";

import Background from "./components/Background.vue";
import { default as Header, HeaderData } from "./components/Header.vue";
import EditToggle from "./components/EditToggle.vue";
import Chart from "./components/Chart.vue";
import Description from "./components/Description.vue";
import { BubbleData, Sections } from "./components/Bubble.vue";

const chance = new Chance();

const DEFAULTS = {
  id: getSlug(chance.animal()),
  editMode: false,
  bubbles: [] as BubbleData[],
  bubblesPerSection: 4,
  bubblesCount: Object.keys(Sections).length,
  dbUri: "mongodb://{user}:{pass}@ds125288.mlab.com:25288/crystal-plan",
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
      id: DEFAULTS.id,
      editMode: DEFAULTS.editMode,
      bubbles: DEFAULTS.bubbles,
      descriptions: DEFAULTS.descriptions,
      description: "",
      selection: "",
      showChart: false,
      header: DEFAULTS.header,
      user: "",
      pass: ""
    };
  },
  created() {
    this.getUrlData();
    this.checkDataIntegrity();
    this.showChart = true;
  },
  methods: {
    getUrlData() {
      if (document !== null && document.location) {
        const hash = document.location.hash;
        const matches = hash.match(/#?(\w+)(\?(\w+)=(\w+))?/);
        if (matches !== null && matches.length === 5) {
          this.id = matches[1] || DEFAULTS.id;
          this.user = matches[3] || "";
          this.pass = matches[4] || "";
        }
      }
      if (this.user.length && this.pass.length) {
        this.getRemoteData();
      } else {
        this.getLocalData();
      }
      this.setUrlData();
    },
    setUrlData() {
      if (document !== null && document.location) {
        document.location.hash = "#" + this.id;
      }
    },
    getRemoteData() {
      console.log("trying to connect with " + this.user + ":" + this.pass);
    },
    getLocalData() {
      const data = Vue.$storage.get(this.id);
      console.log(
        `found ${data ? "" : "no"} data locally with id "${this.id}"`
      );
      this.editMode = (data && data.editMode) || DEFAULTS.editMode;
      this.header = (data && data.header) || DEFAULTS.header;
      this.bubbles = (data && data.bubbles) || DEFAULTS.bubbles;
      this.descriptions = (data && data.descriptions) || DEFAULTS.descriptions;
    },
    setLocalData() {
      Vue.$storage.set(this.id, {
        id: this.id,
        editMode: this.editMode,
        header: this.header,
        bubbles: this.bubbles,
        descriptions: this.descriptions
      });
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
      this.setLocalData();
    },
    updateBubbles(bubbles: BubbleData[]) {
      console.log("saving bubbles to storage...");
      this.setLocalData();
    },
    updateDescription(description: string) {
      console.log("saving updated description to storage...");
      this.description = description;
      this.descriptions[this.selection] = description;
      this.setLocalData();
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
      this.setLocalData();
    }
  }
});
</script>