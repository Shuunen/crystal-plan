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
  apiUrl: 'https://api.jsonbin.io/b/',
  apiKey: '$2a$10$PuQKdZ0fTeGHQG8fLkvv9eMTFYo3rxXY8tLUUc06itr.ooOUCQB06',
  id: getSlug(chance.animal()),
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
      id: DEFAULTS.id,
      editMode: DEFAULTS.editMode,
      bubbles: DEFAULTS.bubbles,
      descriptions: DEFAULTS.descriptions,
      description: "",
      selection: "",
      header: DEFAULTS.header
    };
  },
  created() {
    this.getUrlData();
  },
  methods: {
    getUrlData() {
      let remoteId = "";
      if (document !== null && document.location) {
        const hash = document.location.hash;
        const matches = hash.match(/#?(\w+)(\?([\w\/]+))?/);
        if (matches !== null && matches.length === 4) {
          this.id = matches[1] || DEFAULTS.id;
          remoteId = matches[3] || "";
        }
      }
      if (remoteId.length) {
        this.getRemoteData(remoteId);
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
    importData(data:any){
      console.log('importing data', data)
      this.editMode = (data && data.editMode) || DEFAULTS.editMode;
      this.header = (data && data.header) || DEFAULTS.header;
      this.bubbles = (data && data.bubbles) || DEFAULTS.bubbles;
      this.descriptions = (data && data.descriptions) || DEFAULTS.descriptions;
      this.checkDataIntegrity();
    },
    getRemoteData(remoteId: string) {
      console.log("trying to load remote data " + remoteId + '"');
      let req = new XMLHttpRequest();
      req.onreadystatechange = () => {
        if (req.readyState == XMLHttpRequest.DONE) {
          console.log('got remote data ^^');
          const data = JSON.parse(req.responseText);
          this.importData(data)
        }
      };
      req.open("GET", `${DEFAULTS.apiUrl}${remoteId}`, true);
      req.setRequestHeader("secret-key", DEFAULTS.apiKey);
      req.send();
    },
    getLocalData() {
      const data = Vue.$storage.get(this.id);
      console.log(
        `found ${data ? "" : "no"} data locally with id "${this.id}"`
      );
      this.importData(data)
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
      console.log('checking data integrity...')
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