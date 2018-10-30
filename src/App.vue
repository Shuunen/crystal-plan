<template>
  <div class="app">
    <global-events @keyup.f2="toggleEditMode" @keydown.ctrl.alt.u="updateRemoteData" />
    <section class="section top">
      <background />
      <b-loading :active.sync="isLoading" />
      <div class="container chart has-text-centered" v-if="!isLoading">
        <app-header :content="header" @edit="editForm" :editMode="editMode" />
        <edit-toggle @click.native="toggleEditMode" :editMode="editMode" />
        <chart v-if="bubbles.length" :bubbles="bubbles" @select="selectBubble" @edit="editForm" :editMode="editMode" />
      </div>
    </section>
    <section class="section bottom">
      <div class="container">
        <b-tabs class="ninja" v-model="activeTab">
          <b-tab-item label="actions">
            <description :content="actionsDescription" @descriptionUpdate="updateActionDescription" :editMode="editMode" />
            <actions :actions="actions" @select="selectAction" @edit="editForm" :editMode="editMode" />
            <div class="line start"  @click="addAction">
              <action :data="actionAdd" />
            </div>
          </b-tab-item>
          <b-tab-item label="description">
            <description :content="description" @descriptionUpdate="updateDescription" :editMode="editMode" />
            <div class="line start"  @click="gotoActions">
              <action :data="actionBack" />
            </div>
          </b-tab-item>
        </b-tabs>
      </div>
    </section>
    <b-modal :active.sync="editFormOpened" has-modal-card>
      <EditForm v-bind="editFormData" @close="closeForm" @remove="removeEntry" />
    </b-modal>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import GlobalEvents from 'vue-global-events'
import getSlug from 'speakingurl'

import EditForm, { EditFormData } from './components/EditForm.vue'
import Action, { ActionData } from './components/Action.vue'
import Actions from './components/Actions.vue'
import Background from './components/Background.vue'
import Header, { HeaderData } from './components/Header.vue'
import EditToggle from './components/EditToggle.vue'
import Chart from './components/Chart.vue'
import Description, { DescriptionData } from './components/Description.vue'
import { BubbleData, Sections } from './components/Bubble.vue'

enum Tab {
  actions = 0,
  description = 1
}

const DEFAULTS = {
  action: {
    text: 'My action',
    icon: 'check-circle'
  } as ActionData,
  actionAdd: {
    id: 'add',
    text: 'Add an action',
    icon: 'plus-square',
    button: true
  } as ActionData,
  actionBack: {
    id: 'back',
    text: 'Back to actions',
    icon: 'arrow-alt-circle-left',
    button: true
  } as ActionData,
  actionsDescription:
    '<h2 class="title">Welcome</h2><p><strong>Crystal Plan</strong> is an online app designed to build and present a plan or strategy.</p><p>The <span class="highlight">chart above</span> shows the actors of this plan : persons, ideas, values, anything. Because a great plan is nothing without concrete things to do, you will find <span class="highlight">actions below</span> :</p>',
  actions: [] as ActionData[],
  activeTab: Tab.actions,
  apiUrl: 'https://api.jsonbin.io/b/',
  apiKey: '$2a$10$PuQKdZ0fTeGHQG8fLkvv9eMTFYo3rxXY8tLUUc06itr.ooOUCQB06',
  id: 'foo',
  random: [
    'bar alto',
    'sin seguritat',
    'lorem ipsum',
    'ciao',
    'sit dolor',
    'por erestet',
    'tchu la comida',
    'in amet',
    'aqualeris baked',
    'bouquet',
    'zu amarillo',
    'ploject',
    'ruhe animals',
    'ma plizure',
    'bacon pasty',
    'vinci mador',
    'alan awake',
    'malohe sutur',
    'a priore sur',
    'quel memento',
    'kalitat',
    'buru menhir'
  ],
  remoteId: '',
  editMode: false,
  bubbles: [] as BubbleData[],
  bubblesPerSection: 4,
  bubblesCount: Object.keys(Sections).length,
  editFormData: {
    data: {} as EditFormData
  },
  image: 'https://bulma.io/images/placeholders/128x128.png',
  description: '' as DescriptionData,
  descriptions: {} as DescriptionsData,
  noSelectionDescription: 'Please select an action.' as DescriptionData,
  noContentDescription: '<h1 class="title">Great title</h1><br>No content yet for this action.' as DescriptionData,
  header: { text: 'Crystal Plan.' } as HeaderData
}
// 3 sections x 4 bubbles = 12 by default
DEFAULTS.bubblesCount *= DEFAULTS.bubblesPerSection

declare module 'vue/types/vue' {
  interface VueConstructor {
    $storage: any;
    pell: any;
  }
}

enum Types {
  bubble = 'bubble',
  action = 'action'
}

interface DescriptionsData {
  [key: string]: DescriptionData;
}

interface AppData {
  id: string;
  actionsDescription: string;
  actions: ActionData[];
  header: HeaderData;
  bubbles: BubbleData[];
  descriptions: DescriptionsData;
}

export default Vue.extend({
  name: 'app',
  components: {
    Action,
    Actions,
    Background,
    Chart,
    Description,
    EditForm,
    EditToggle,
    GlobalEvents,
    AppHeader: Header // header is reserved
  },
  data () {
    return {
      id: DEFAULTS.id,
      actionsDescription: DEFAULTS.actionsDescription,
      actionAdd: DEFAULTS.actionAdd,
      actionBack: DEFAULTS.actionBack,
      actions: DEFAULTS.actions,
      activeTab: DEFAULTS.activeTab,
      remoteId: DEFAULTS.remoteId,
      editMode: DEFAULTS.editMode,
      editFormOpened: false,
      editFormData: DEFAULTS.editFormData,
      bubbles: DEFAULTS.bubbles,
      descriptions: DEFAULTS.descriptions,
      description: DEFAULTS.description,
      selection: '',
      header: DEFAULTS.header,
      isLoading: true
    }
  },
  created () {
    this.getUrlData()
  },
  methods: {
    getUrlData () {
      if (document !== null && document.location) {
        const hash = document.location.hash
        const matches = hash.match(/#?(\w+)(\?remote=([\w/]+))?/)
        if (matches !== null && matches.length === 4) {
          this.id = matches[1] || DEFAULTS.id
          this.remoteId = matches[3] || ''
        }
      }
      if (this.remoteId.length) {
        this.getRemoteData()
      } else {
        this.getLocalData()
      }
    },
    setUrlData () {
      if (document !== null && document.location) {
        document.location.hash = '#' + this.id
      }
    },
    importData (data: AppData) {
      console.log('importing data', data)
      this.actions = (data && data.actions) || DEFAULTS.actions
      this.actionsDescription =
        (data && data.actionsDescription) || DEFAULTS.actionsDescription
      this.header = (data && data.header) || DEFAULTS.header
      this.bubbles = (data && data.bubbles) || DEFAULTS.bubbles
      this.descriptions = (data && data.descriptions) || DEFAULTS.descriptions
      this.checkDataIntegrity()
    },
    getRemoteData () {
      console.log('trying to load remote data ' + this.remoteId + '"')
      let req = new XMLHttpRequest()
      req.onreadystatechange = () => {
        if (req.readyState === XMLHttpRequest.DONE) {
          console.log('got remote data')
          const data = JSON.parse(req.responseText)
          this.importData(data)
        }
      }
      req.open('GET', `${DEFAULTS.apiUrl}${this.remoteId}`, true)
      req.setRequestHeader('secret-key', DEFAULTS.apiKey)
      req.send()
    },
    updateRemoteData () {
      if (!this.remoteId || !this.remoteId.length) {
        this.remoteId = prompt('What is the remote id ?') || ''
      }
      this.$toast.open('Updating remote data...')
      let req = new XMLHttpRequest()
      req.onreadystatechange = () => {
        if (req.readyState === XMLHttpRequest.DONE) {
          this.$toast.open({
            message: 'Remote schame updated correctly!',
            type: 'is-success'
          })
        }
      }
      req.open('PUT', `${DEFAULTS.apiUrl}${this.remoteId}`, true)
      req.setRequestHeader('Content-type', 'application/json')
      req.setRequestHeader('secret-key', DEFAULTS.apiKey)
      req.setRequestHeader('versioning', 'false')
      req.send(JSON.stringify(this.getCurrentData()))
    },
    getCurrentData (): AppData {
      console.log('getting current app data state')
      // deep clone then clean bubble states
      const bubbles = this.copy(this.bubbles).map((b: BubbleData) => {
        b.selected = false
        b.shaded = false
        return b
      })
      return {
        id: this.id,
        actionsDescription: this.actionsDescription,
        actions: this.actions,
        header: this.header,
        bubbles,
        descriptions: this.descriptions
      }
    },
    getLocalData () {
      const data = Vue.$storage.get(this.id)
      console.log(
        `found ${data ? '' : 'no'} data locally with id "${this.id}"`
      )
      this.importData(data)
    },
    setLocalData () {
      Vue.$storage.set(this.id, this.getCurrentData())
      this.setUrlData()
    },
    checkDataIntegrity () {
      // console.log('checking data integrity...')
      if (this.bubbles.length <= 0) {
        this.addRandomBubbles()
      } else if (this.bubbles.length < DEFAULTS.bubblesCount) {
        this.addMissingBubbles()
      }
      if (this.actions.length <= 0) {
        this.addRandomActions()
      }
      this.isLoading = false
    },
    getRandomString (): string {
      return (
        DEFAULTS.random.pop() ||
        Math.random()
          .toString(36)
          .substring(7)
      )
    },
    getRandomId (): string {
      return getSlug(this.getRandomString())
    },
    addRandomActions () {
      console.log('generating actions...')
      for (let i = 0; i < 8; i++) {
        const text = this.getRandomString()
        this.actions.push({
          id: getSlug(text),
          text,
          image: DEFAULTS.image
        })
      }
      console.log('generated :', this.actions)
    },
    addMissingBubbles () {
      console.log('missing bubbles detected')
      console.log('but this feature is not developed yet')
    },
    addRandomBubbles () {
      console.log('generating bubbles...')
      Object.keys(Sections).forEach(section => {
        for (let i = 0; i < DEFAULTS.bubblesPerSection; i++) {
          this.addRandomBubble(section as Sections)
        }
      })
      console.log('generated :', this.bubbles)
    },
    addRandomBubble (section: Sections) {
      this.bubbles.push(
        new BubbleData({
          text: this.getRandomString(),
          image: DEFAULTS.image,
          section: section
        })
      )
    },
    toggleEditMode () {
      this.editMode = !this.editMode
    },
    updateBubbles (bubbles: BubbleData[]) {
      console.log('saving bubbles to storage...')
      this.setLocalData()
    },
    updateDescription (description: DescriptionData) {
      console.log('saving updated selection description to storage...')
      this.description = description
      this.descriptions[this.selection] = description
      this.setLocalData()
    },
    updateActionDescription (description: DescriptionData) {
      console.log('saving updated actions description to storage...')
      this.actionsDescription = description
      this.setLocalData()
    },
    updateHeader (header: HeaderData) {
      console.log('saving updated header to storage...', header)
      this.header = header
      this.setLocalData()
    },
    copy (object: any) {
      return JSON.parse(JSON.stringify(object))
    },
    editForm (data: EditFormData) {
      console.log('user wants to edit data')
      this.editFormData.data = data
      this.editFormOpened = true
    },
    closeForm () {
      console.log('edit form closed')
      this.editFormOpened = false
      this.setLocalData()
    },
    removeEntry () {
      const data = this.editFormData.data
      const type = data.type as Types
      if (!type) {
        this.error('Cannot delete entry', 'no type provided')
        return
      } else {
        console.log('deleting', type, 'with id', data.id)
      }
      let array = null
      if (type === Types.bubble) {
        array = this.bubbles as EditFormData[]
      } else if (type === Types.action) {
        array = this.actions as EditFormData[]
      } else {
        this.error('Unhandled type : "' + type + '"')
      }
      if (array) {
        const index = array.findIndex(e => e.id === data.id)
        if (index > -1) {
          array.splice(index, 1)
          this.info(`Deleted "${data.id}" successfully`)
        } else {
          this.error('Failed deleting item', 'item not found via id')
        }
      }
      this.editFormOpened = false
    },
    selectAction (action: ActionData) {
      this.selection = action.id
      console.log('current selection :', this.selection)
      if (this.selection.length) {
        if (this.descriptions.hasOwnProperty(this.selection)) {
          this.description = this.descriptions[this.selection]
        } else {
          this.description = DEFAULTS.noContentDescription
        }
        this.activeTab = Tab.description
      } else {
        this.activeTab = Tab.actions
      }
    },
    selectBubble (bubble: BubbleData) {
      console.log('bubble selected :', bubble.id)
    },
    gotoActions () {
      this.activeTab = Tab.actions
    },
    addAction () {
      this.$toast.open('Adding action...')
      const action = this.copy(DEFAULTS.action)
      action.id = this.getRandomId()
      this.actions.push(action)
      this.editForm(action)
    },
    error (toast: string, details = '') {
      this.$toast.open({
        duration: 5000,
        message: toast,
        position: 'is-bottom',
        type: 'is-danger'
      })
      if (details.length) {
        console.error(toast, ':', details)
      } else {
        console.error(toast)
      }
    },
    info (toast: string, details = '') {
      this.$toast.open({
        duration: 3000,
        message: toast,
        position: 'is-top',
        type: 'is-info'
      })
      if (details.length) {
        console.log(toast, ':', details)
      } else {
        console.log(toast)
      }
    }
  }
})

export { Types }
</script>

<style lang="scss">
.b-tabs.ninja .tabs {
  display: none;
}
.section.top,
.section.bottom {
  .container {
    max-width: 960px;
    margin: auto;
  }
}
</style>
