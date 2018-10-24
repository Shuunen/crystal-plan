<template>
    <div class="description">
      <div class="text" v-show="!editMode" v-html="content"></div>
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
        "bold",
        "underline",
        {
          name: "italic",
          result: () => pell.exec("italic")
        },
        {
          name: "backColor",
          icon: '<div class="highlight">A</div>',
          title: "Highlight Color",
          result: (): any => pell.exec("insertHTML", '<span class="highlight">Hey</span>')
        },
        /* {
        name: 'custom',
        icon: '<b><u><i>C</i></u></b>',
        title: 'Custom Action',
        result: () => console.log('YOLO')
      }, */
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
.description {
  max-width: 970px;
  margin: auto;
  .text {
    margin: 3rem 6rem;
    min-height: 300px;
  }
  .vp-editor {
    margin: 2rem 6rem;
  }
}
</style>
