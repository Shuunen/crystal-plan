<template>
  <div class="app col full-height">
    <global-events @keyup.f2="toggleEditMode" @keydown.ctrl.alt.u="updateRemoteData" />
    <section class="section top full-width">
      <background />
      <b-loading :active.sync="isLoading" />
      <div v-if="!isLoading" class="container chart has-text-centered">
        <app-header :content="header" :edit-mode="editMode" @edit="editForm" />
        <edit-toggle :edit-mode="editMode" @click.native="toggleEditMode" />
        <bubbles v-if="bubbles.length" :bubbles="bubbles" :edit-mode="editMode" @select="selectBubble" @edit="editForm" />
      </div>
    </section>
    <section class="section bottom full-width grow">
      <div class="container">
        <b-tabs v-model="activeTab" class="ninja">
          <b-tab-item label="actions">
            <description :content="actionsDescription" :edit-mode="editMode" @description-update="updateActionDescription" />
            <actions :actions="actions" :edit-mode="editMode" @select="selectAction" @edit="editForm" />
            <div v-show="editMode" class="line start" @click="addAction">
              <action :data="actionAdd" />
            </div>
          </b-tab-item>
          <b-tab-item label="description">
            <description :content="description" :edit-mode="editMode" @description-update="updateDescription" />
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
import { BubbleData, Sections } from '@/components/bubble.vue'
import { Component, Vue } from 'vue-property-decorator'
import { copy, getRandomImageUrl, getRandomString } from 'shuutils'
import Action, { ActionData } from '@/components/action.vue'
import Actions from '@/components/actions.vue'
import Background from '@/components/background.vue'
import Bubbles from '@/components/bubbles.vue'
import Description from '@/components/description.vue'
import EditForm, { EditFormData } from '@/components/edit-form.vue'
import EditToggle from '@/components/edit-toggle.vue'
import GlobalEvents from 'vue-global-events'
import Header, { HeaderData } from '@/components/header.vue'

enum Tab {
  actions = 0,
  description = 1
}

interface DescriptionsData {
  [key: string]: string
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

interface AppData {
  id: string
  actionsDescription: string
  actions: ActionData[]
  header: HeaderData
  bubbles: BubbleData[]
  descriptions: DescriptionsData
}

@Component({
  name: 'app',
  components: {
    Action,
    Actions,
    Background,
    Bubbles,
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
    if (this.remoteId.length > 0) {
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
    console.log('importing data :', data)
    this.actions = (data && data.actions) || DEFAULTS.actions
    this.actionsDescription = (data && data.actionsDescription) || DEFAULTS.actionsDescription
    this.header = (data && data.header) || DEFAULTS.header
    this.bubbles = (data && data.bubbles) || DEFAULTS.bubbles
    this.descriptions = (data && data.descriptions) || DEFAULTS.descriptions
    this.checkDataIntegrity()
  }

  getRemoteData () {
    console.log('trying to load remote data ' + this.remoteId + '"')
    const request = new XMLHttpRequest()
    request.onreadystatechange = () => {
      if (request.readyState === XMLHttpRequest.DONE) {
        console.log('got remote data')
        const data = JSON.parse(request.responseText)
        this.importData(data)
      }
    }
    request.open('GET', `${DEFAULTS.apiUrl}${this.remoteId}`, true)
    request.setRequestHeader('secret-key', DEFAULTS.apiKey)
    request.send()
  }

  updateRemoteData () {
    if (!this.remoteId || this.remoteId.length === 0) {
      this.remoteId = prompt('What is the remote id ?') || ''
    }
    console.log('Updating remote data...')
    const request = new XMLHttpRequest()
    request.onreadystatechange = () => {
      if (request.readyState === XMLHttpRequest.DONE) {
        console.log('Remote schame updated correctly!')
      }
    }
    request.open('PUT', `${DEFAULTS.apiUrl}${this.remoteId}`, true)
    request.setRequestHeader('Content-type', 'application/json')
    request.setRequestHeader('secret-key', DEFAULTS.apiKey)
    request.setRequestHeader('versioning', 'false')
    request.send(JSON.stringify(this.getCurrentData()))
  }

  getCurrentData (): AppData {
    console.log('getting current app data state')
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
    console.log(`found ${data ? '' : 'no'} data locally with id "${this.id}"`)
    this.importData(data)
  }

  setLocalData () {
    Vue.$storage.set(this.id, this.getCurrentData())
    this.setUrlData()
  }

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
  }

  addRandomActions () {
    console.log('generating actions...')
    for (let index = 0; index < 8; index++) {
      this.actions.push({
        text: getRandomString(),
        image: getRandomImageUrl(),
      })
    }
    console.log('generated : ' + this.actions.length + ' actions')
  }

  addMissingBubbles () {
    console.log('missing bubbles detected')
    console.log('but this feature is not developed yet')
  }

  addRandomBubbles () {
    console.log('generating bubbles...')
    Object.keys(Sections).forEach(section => {
      for (let index = 0; index < DEFAULTS.bubblesPerSection; index++) {
        this.addRandomBubble(section as Sections)
      }
    })
    console.log('generated : ' + this.bubbles.length + ' bubbles')
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
    console.log('saving bubbles to storage...')
    this.setLocalData()
  }

  updateDescription (description = '') {
    console.log('saving updated selection description to storage...')
    this.description = description
    this.descriptions[this.selection] = description
    this.setLocalData()
  }

  updateActionDescription (description = '') {
    console.log('saving updated actions description to storage...')
    this.actionsDescription = description
    this.setLocalData()
  }

  updateHeader (header: HeaderData) {
    console.log('saving updated header to storage : ' + header)
    this.header = header
    this.setLocalData()
  }

  editForm (data: EditFormData) {
    console.log('user wants to edit data')
    this.editFormData.data = data
    this.editFormOpened = true
  }

  closeForm () {
    console.log('edit form closed')
    this.editFormOpened = false
    this.setLocalData()
  }

  removeEntry () {
    const data = this.editFormData.data
    const type = data.type as Types
    if (!type) {
      console.error('Cannot delete entry : no type provided')
      return
    }
    console.log(`deleting ${type} with id ${data.id}`)
    let array
    if (type === Types.bubble) {
      array = this.bubbles as EditFormData[]
    } else if (type === Types.action) {
      array = this.actions as EditFormData[]
    } else {
      console.error('Unhandled type : "' + type + '"')
    }
    if (array) {
      const index = array.findIndex(item => item.id === data.id)
      if (index > -1) {
        array.splice(index, 1)
        console.log(`Deleted "${data.id}" successfully`)
      } else {
        console.error('Failed deleting item : item not found via id')
      }
    }
    this.editFormOpened = false
  }

  selectAction (action: ActionData) {
    this.selection = action.id || ''
    if (this.selection.length > 0) {
      console.log('selected action : ' + this.selection)
      this.description = this.descriptions[this.selection] ? this.descriptions[this.selection] : DEFAULTS.noContentDescription
      this.activeTab = Tab.description
      const bubble = this.bubbles.find(b => (b.id === this.selection))
      if (bubble) {
        this.bubbles.forEach(b => (b.selected = false))
        bubble.selected = true
      }
    } else {
      console.log('no action selected')
      this.activeTab = Tab.actions
    }
  }

  selectBubble (bubble: BubbleData) {
    console.log('bubble selected :', bubble)
    if (bubble.selected) {
      bubble.selected = false
      this.activeTab = Tab.actions
      return
    }
    this.bubbles.forEach(b => (b.selected = false))
    bubble.selected = true
    const action = this.actions.find(a => a.id === bubble.id)
    if (action) this.selectAction(action)
  }

  gotoActions () {
    this.activeTab = Tab.actions
  }

  addAction () {
    console.log('Adding action...')
    const action = copy(DEFAULTS.action)
    this.actions.push(action)
    this.editForm(action)
  }
}

export { Types }
</script>
