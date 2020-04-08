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
            <div class="line start" v-show="editMode" @click="addAction">
              <action :data="actionAdd" />
            </div>
          </b-tab-item>
          <b-tab-item label="description">
            <description :content="description" @descriptionUpdate="updateDescription" :editMode="editMode" />
            <div class="line start" @click="gotoActions">
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
import GlobalEvents from 'vue-global-events'
import { copy, getRandomImageUrl, getRandomString } from 'shuutils'

import EditForm, { EditFormData } from '@/components/EditForm.vue'
import Action, { ActionData } from '@/components/Action.vue'
import Actions from '@/components/Actions.vue'
import Background from '@/components/Background.vue'
import Header, { HeaderData } from '@/components/Header.vue'
import EditToggle from '@/components/EditToggle.vue'
import Chart from '@/components/Chart.vue'
import Description from '@/components/Description.vue'
import { BubbleData, Sections } from '@/components/Bubble.vue'

import { Component, Vue } from 'vue-property-decorator'

enum Tab {
  actions = 0,
  description = 1
}

const DEFAULTS = {
  action: {
    text: 'My action',
    icon: 'check-circle',
  } as ActionData,
  actionAdd: {
    id: 'add',
    text: 'Add an action',
    icon: 'plus-square',
    button: true,
  } as ActionData,
  actionBack: {
    id: 'back',
    text: 'Back to actions',
    icon: 'arrow-alt-circle-left',
    button: true,
  } as ActionData,
  actionsDescription:
    '<h1 class="title">Welcome</h1><p><strong>Crystal Plan</strong> is an online app designed to build and present a plan or strategy.</p><p>The <span class="highlight highlight-yellow">chart above</span> shows the actors of this plan : persons, ideas, values, anything. Because a great plan is nothing without concrete things to do, you will find <span class="highlight highlight-yellow">actions below</span> :</p>',
  actions: [] as ActionData[],
  activeTab: Tab.actions,
  apiUrl: 'https://api.jsonbin.io/b/',
  apiKey: '$2a$10$PuQKdZ0fTeGHQG8fLkvv9eMTFYo3rxXY8tLUUc06itr.ooOUCQB06',
  id: 'foo',
  remoteId: '',
  editMode: false,
  bubbles: [] as BubbleData[],
  bubblesPerSection: 4,
  bubblesCount: Object.keys(Sections).length,
  editFormData: {
    data: {} as EditFormData,
  },
  description: '',
  descriptions: {} as DescriptionsData,
  noSelectionDescription: 'Please select an action.',
  noContentDescription: '<h1 class="title">Great title</h1><br>No content yet for this action.',
  header: { text: 'Crystal Plan.' } as HeaderData,
}
// 3 sections x 4 bubbles = 12 by default
DEFAULTS.bubblesCount *= DEFAULTS.bubblesPerSection

enum Types {
  bubble = 'bubble',
  action = 'action'
}

interface DescriptionsData {
  [key: string]: string;
}

interface AppData {
  id: string;
  actionsDescription: string;
  actions: ActionData[];
  header: HeaderData;
  bubbles: BubbleData[];
  descriptions: DescriptionsData;
}

@Component({
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
    AppHeader: Header, // header is reserved
  },
})
export default class App extends Vue {
  id = DEFAULTS.id;
  actionsDescription = DEFAULTS.actionsDescription;
  actionAdd = DEFAULTS.actionAdd;
  actionBack = DEFAULTS.actionBack;
  actions = DEFAULTS.actions;
  activeTab = DEFAULTS.activeTab;
  remoteId = DEFAULTS.remoteId;
  editMode = DEFAULTS.editMode;
  editFormOpened = false;
  editFormData = DEFAULTS.editFormData;
  bubbles = DEFAULTS.bubbles;
  descriptions = DEFAULTS.descriptions;
  description = DEFAULTS.description;
  selection = '';
  header = DEFAULTS.header;
  isLoading = true;

  created () {
    this.getUrlData()
  }

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
  }

  setUrlData () {
    if (document !== null && document.location) {
      document.location.hash = '#' + this.id
    }
  }

  importData (data: AppData) {
    this.log('importing data : ' + data)
    this.actions = (data && data.actions) || DEFAULTS.actions
    this.actionsDescription =
      (data && data.actionsDescription) || DEFAULTS.actionsDescription
    this.header = (data && data.header) || DEFAULTS.header
    this.bubbles = (data && data.bubbles) || DEFAULTS.bubbles
    this.descriptions = (data && data.descriptions) || DEFAULTS.descriptions
    this.checkDataIntegrity()
  }

  getRemoteData () {
    this.log('trying to load remote data ' + this.remoteId + '"')
    const req = new XMLHttpRequest()
    req.onreadystatechange = () => {
      if (req.readyState === XMLHttpRequest.DONE) {
        this.log('got remote data')
        const data = JSON.parse(req.responseText)
        this.importData(data)
      }
    }
    req.open('GET', `${DEFAULTS.apiUrl}${this.remoteId}`, true)
    req.setRequestHeader('secret-key', DEFAULTS.apiKey)
    req.send()
  }

  updateRemoteData () {
    if (!this.remoteId || !this.remoteId.length) {
      this.remoteId = prompt('What is the remote id ?') || ''
    }
    this.log('Updating remote data...')
    const req = new XMLHttpRequest()
    req.onreadystatechange = () => {
      if (req.readyState === XMLHttpRequest.DONE) {
        this.log('Remote schame updated correctly!')
      }
    }
    req.open('PUT', `${DEFAULTS.apiUrl}${this.remoteId}`, true)
    req.setRequestHeader('Content-type', 'application/json')
    req.setRequestHeader('secret-key', DEFAULTS.apiKey)
    req.setRequestHeader('versioning', 'false')
    req.send(JSON.stringify(this.getCurrentData()))
  }

  getCurrentData (): AppData {
    this.log('getting current app data state')
    // deep clone then clean bubble states
    const bubbles = copy(this.bubbles).map((b: BubbleData) => {
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
      descriptions: this.descriptions,
    }
  }

  getLocalData () {
    const data = Vue.$storage.get(this.id)
    this.log(`found ${data ? '' : 'no'} data locally with id "${this.id}"`)
    this.importData(data)
  }

  setLocalData () {
    Vue.$storage.set(this.id, this.getCurrentData())
    this.setUrlData()
  }

  checkDataIntegrity () {
    // this.log('checking data integrity...')
    if (this.bubbles.length <= 0) {
      this.addRandomBubbles()
    } else if (this.bubbles.length < DEFAULTS.bubblesCount) {
      this.addMissingBubbles()
    }
    if (this.actions.length <= 0) {
      this.addRandomActions()
    }
    this.isLoading = false
  }

  addRandomActions () {
    this.log('generating actions...')
    for (let i = 0; i < 8; i++) {
      this.actions.push({
        text: getRandomString(),
        image: getRandomImageUrl(),
      })
    }
    this.log('generated : ' + this.actions.length + ' actions')
  }

  addMissingBubbles () {
    this.log('missing bubbles detected')
    this.log('but this feature is not developed yet')
  }

  addRandomBubbles () {
    this.log('generating bubbles...')
    Object.keys(Sections).forEach(section => {
      for (let i = 0; i < DEFAULTS.bubblesPerSection; i++) {
        this.addRandomBubble(section as Sections)
      }
    })
    this.log('generated : ' + this.bubbles.length + ' bubbles')
  }

  addRandomBubble (section: Sections) {
    this.bubbles.push(
      new BubbleData({
        text: getRandomString(),
        image: getRandomImageUrl(),
        section: section,
      }),
    )
  }

  toggleEditMode () {
    this.editMode = !this.editMode
  }

  updateBubbles () {
    this.log('saving bubbles to storage...')
    this.setLocalData()
  }

  updateDescription (description = '') {
    this.log('saving updated selection description to storage...')
    this.description = description
    this.descriptions[this.selection] = description
    this.setLocalData()
  }

  updateActionDescription (description = '') {
    this.log('saving updated actions description to storage...')
    this.actionsDescription = description
    this.setLocalData()
  }

  updateHeader (header: HeaderData) {
    this.log('saving updated header to storage : ' + header)
    this.header = header
    this.setLocalData()
  }

  editForm (data: EditFormData) {
    this.log('user wants to edit data')
    this.editFormData.data = data
    this.editFormOpened = true
  }

  closeForm () {
    this.log('edit form closed')
    this.editFormOpened = false
    this.setLocalData()
  }

  removeEntry () {
    const data = this.editFormData.data
    const type = data.type as Types
    if (!type) {
      this.error('Cannot delete entry : no type provided')
      return
    }
    this.log(`deleting ${type} with id ${data.id}`)
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
        this.log(`Deleted "${data.id}" successfully`)
      } else {
        this.error('Failed deleting item : item not found via id')
      }
    }
    this.editFormOpened = false
  }

  selectAction (action: ActionData) {
    this.selection = action.id || ''
    if (this.selection.length) {
      this.log('selected action : ' + this.selection)
      if (this.descriptions[this.selection]) {
        this.description = this.descriptions[this.selection]
      } else {
        this.description = DEFAULTS.noContentDescription
      }
      this.activeTab = Tab.description
    } else {
      this.log('no action selected')
      this.activeTab = Tab.actions
    }
  }

  selectBubble (bubble: BubbleData) {
    this.log('bubble selected : ' + bubble.id)
  }

  gotoActions () {
    this.activeTab = Tab.actions
  }

  addAction () {
    this.log('Adding action...')
    const action = copy(DEFAULTS.action)
    this.actions.push(action)
    this.editForm(action)
  }

  error (message: string) {
    console.error(message)
  }

  log (message: string) {
    console.log(message)
  }
}

export { Types }
</script>
