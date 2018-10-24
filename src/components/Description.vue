<template>
    <div class="description-wrapper">
      <div class="description" v-show="!editMode" v-html="content"></div>
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
import Vue from "vue";

const ensureHTTP = (str: string) =>
  (/^https?:\/\//.test(str) && str) || `http://${str}`;

export default Vue.extend({
  props: {
    editMode: {
      type: Boolean,
      required: true
    },
    content: {
      type: String,
      required: true
    }
  },
  computed: {
    editorContent: {
      get: function(): string {
        return this.content;
      },
      set: function(str: string) {
        this.newContent = str;
      }
    }
  },
  data() {
    return {
      newContent: "",
      editorOptions: [
        "heading1",
        "bold",
        "underline",
        {
          name: "italic",
          result: () => pell.exec("italic")
        },
        {
          name: "highlight",
          icon: '<div class="highlight">A</div>',
          title: "Highlight Color",
          result: (): any => {
            const selection = window.getSelection().toString()
            const html = selection.replace(/^(\s)*([A-zÀ-ÿ-_\s]+[A-zÀ-ÿ-_])(\s)*$/,'$1<span class="highlight">$2</span>$3')
            console.log('will put new html', html)
            pell.exec("insertHTML", html)
          }
        },
        {
          name: "image",
          result: () => {
            const url = window.prompt("Enter the image URL");
            if (url) pell.exec("insertImage", ensureHTTP(url));
          }
        },
        {
          name: "link",
          result: () => {
            const url = window.prompt("Enter the link URL");
            if (url) pell.exec("createLink", ensureHTTP(url));
          }
        },
        {
          name: "clean",
          icon: '<div>Clean</div>',
          title: "Clear all formating",
          result: () => pell.exec("removeFormat")
        }
      ],
      editorPlaceholder: "Write something amazing...",
      editorClasses: {
        actionbar: "pell-actionbar",
        button: "pell-button",
        content: "pell-content",
        selected: "pell-button-selected"
      }
    };
  },
  methods: {
    updateData() {
      //TODO: debounce ! ^^
      this.$emit("descriptionUpdate", this.newContent);
    }
  }
});
</script>

<style lang="scss">
.description-wrapper {
  max-width: 970px;
  .description {
    margin: 2rem 6rem;
    min-height: 300px;
  }
  .vp-editor {
    margin: 1rem 6rem;
    .pell-content {
      height: inherit;
      min-height: 300px;
    }
  }
}
</style>
