<template>
  <div class="description-wrapper">
    <div class="description content is-medium" v-show="!editMode" v-html="content"></div>
    <vue-pell-editor
      class="content"
      v-show="editMode"
      v-model="editorContent"
      :actions="editorOptions"
      :content="editorContent"
      :placeholder="editorPlaceholder"
      :style-with-css="false"
      :classes="editorClasses"
      default-paragraph-separator="p"
      @change="updateDataDebounced"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Utils from '@/utils'

function highlight (type: string) {
  const cls = 'highlight-' + type
  const getSelection = () => window.getSelection() + ''
  return {
    name: cls,
    icon: `<div class="highlight ${cls}">A</div>`,
    title: 'Highlight text',
    result: (): void => {
      pell.exec('insertHTML', Utils.wrapWithClass(getSelection(), 'highlight ' + cls))
    }
  }
}

// check https://www.utf8icons.com/ for icons
const features = {
  italic: {
    name: 'italic',
    result: () => pell.exec('italic')
  },
  highlightGreen: highlight('green'),
  highlightYellow: highlight('yellow'),
  highlightRed: highlight('red'),
  image: {
    name: 'image',
    result: () => {
      const url = window.prompt('Enter the image URL')
      if (url) pell.exec('insertImage', Utils.validLink(url))
    }
  },
  link: {
    name: 'link',
    result: () => {
      const url = window.prompt('Enter the link URL')
      if (url) pell.exec('createLink', Utils.validLink(url))
    }
  },
  clean: {
    name: 'clean',
    icon: '<div>✖</div>',
    title: 'Clear all formating',
    result: () => pell.exec('removeFormat')
  }
}

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
      updateDataDebounced: {} as () => void,
      newContent: '',
      editorOptions: [
        'heading1',
        'bold',
        features.italic,
        'underline',
        features.highlightGreen,
        features.highlightYellow,
        features.highlightRed,
        features.image,
        features.link,
        'ulist',
        'quote',
        features.clean,
        'line'
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
  created () {
    this.updateDataDebounced = Utils.debounce(this.updateData, 1000)
  },
  methods: {
    updateData () {
      this.$emit('descriptionUpdate', this.newContent)
    }
  }
})

export { DescriptionData }
</script>

<style>
.description-wrapper .description {
  margin-top: 1.1rem;
}
.description-wrapper .vp-editor {
  top: -1rem;
}
.description-wrapper .vp-editor .pell-content {
  height: inherit;
  min-height: 300px;
}
</style>
