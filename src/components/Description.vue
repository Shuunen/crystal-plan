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
/* global pell */
import { Component, Prop, Vue } from 'vue-property-decorator'
import { debounce } from 'shuutils'

function wrapWithClass (text: string, cls: string): string {
  return text.replace(
    /^(\s)*([A-Za-zÀ-ÿ-_\s]+[A-Za-zÀ-ÿ-_])(\s)*$/,
    '$1<span class="' + cls + '">$2</span>$3',
  )
}

function validLink (str: string): string {
  return (/^https?:\/\//.test(str) && str) || `https://${str}`
}

function highlight (type: string) {
  const cls = 'highlight-' + type
  const getSelection = () => window.getSelection() + ''
  return {
    name: cls,
    icon: `<div class="highlight ${cls}">A</div>`,
    title: 'Highlight text',
    result: (): void => {
      pell.exec(
        'insertHTML',
        wrapWithClass(getSelection(), 'highlight ' + cls),
      )
    },
  }
}

// check https://www.utf8icons.com/ for icons
const features = {
  italic: {
    name: 'italic',
    result: () => pell.exec('italic'),
  },
  highlightGreen: highlight('green'),
  highlightYellow: highlight('yellow'),
  highlightRed: highlight('red'),
  image: {
    name: 'image',
    result: () => {
      const url = window.prompt('Enter the image URL')
      if (url) pell.exec('insertImage', validLink(url))
    },
  },
  link: {
    name: 'link',
    result: () => {
      const url = window.prompt('Enter the link URL')
      if (url) pell.exec('createLink', validLink(url))
    },
  },
  clean: {
    name: 'clean',
    icon: '<div>✖</div>',
    title: 'Clear all formating',
    result: () => pell.exec('removeFormat'),
  },
}

@Component
export default class HelloWorld extends Vue {
  @Prop() private content!: string;
  @Prop() private editMode!: boolean;

  updateDataDebounced = {};
  newContent = '';
  editorOptions = [
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
    'line',
  ];

  editorPlaceholder = 'Write something amazing...';
  editorClasses = {
    actionbar: 'pell-actionbar',
    button: 'pell-button',
    content: 'pell-content',
    selected: 'pell-button-selected',
  };

  get editorContent () {
    return this.content
  }

  set editorContent (html) {
    this.newContent = html
  }

  created () {
    this.updateDataDebounced = debounce(this.updateData, 1000)
  }

  updateData () {
    this.$emit('descriptionUpdate', this.newContent)
  }
}
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
