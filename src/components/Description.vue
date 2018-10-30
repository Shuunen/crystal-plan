<template>
    <div class="description-wrapper">
      <div class="description content is-medium" v-show="!editMode" v-html="content"></div>
      <vue-pell-editor v-show="editMode"
          v-model="editorContent"
          :actions="editorOptions"
          :content="editorContent"
          :placeholder="editorPlaceholder"
          :style-with-css="false"
          :classes="editorClasses"
          default-paragraph-separator="p"
          @change="updateData"
      />
    </div>
</template>

<script lang="ts">
import Vue from 'vue'

const ensureHTTP = (str: string) =>
  (/^https?:\/\//.test(str) && str) || `http://${str}`

type DescriptionData = string

export default Vue.extend({
  props: {
    editMode: {
      type: Boolean,
      required: true
    },
    content: {
      type: String as () => DescriptionData,
      required: true
    }
  },
  computed: {
    editorContent: {
      get: function (): DescriptionData {
        return this.content
      },
      set: function (html: DescriptionData) {
        this.newContent = html
      }
    }
  },
  data () {
    return {
      newContent: '',
      editorOptions: [
        'heading1',
        'bold',
        'underline',
        'line',
        {
          name: 'italic',
          result: () => pell.exec('italic')
        },
        {
          name: 'highlight',
          icon: '<div class="highlight">A</div>',
          title: 'Highlight Color',
          result: (): void => {
            const selection = window.getSelection().toString()
            const html = selection.replace(
              /^(\s)*([A-zÀ-ÿ-_\s]+[A-zÀ-ÿ-_])(\s)*$/,
              '$1<span class="highlight">$2</span>$3'
            )
            console.log('will put new html', html)
            pell.exec('insertHTML', html)
          }
        },
        {
          name: 'image',
          result: () => {
            const url = window.prompt('Enter the image URL')
            if (url) pell.exec('insertImage', ensureHTTP(url))
          }
        },
        {
          name: 'link',
          result: () => {
            const url = window.prompt('Enter the link URL')
            if (url) pell.exec('createLink', ensureHTTP(url))
          }
        },
        {
          name: 'clean',
          icon: '<div>Clean</div>',
          title: 'Clear all formating',
          result: () => pell.exec('removeFormat')
        }
      ],
      editorPlaceholder: 'Write something amazing...',
      editorClasses: {
        actionbar: 'pell-actionbar',
        button: 'pell-button',
        content: 'pell-content',
        selected: 'pell-button-selected'
      }
    }
  },
  methods: {
    updateData () {
      // TODO: debounce ! ^^
      this.$emit('descriptionUpdate', this.newContent)
    }
  }
})

export { DescriptionData }
</script>

<style lang="scss">
.description-wrapper {
  .description {
    margin: 1.1rem 0.5rem;
    /* min-height: 300px; */
  }
  .vp-editor {
    top: -1rem;
    .pell-content {
      height: inherit;
      min-height: 300px;
    }
  }
}
</style>
