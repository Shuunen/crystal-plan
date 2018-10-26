<template>
  <div class="actions-wrapper">
    <div class="col start">
      <h2 class="title">Actions.</h2>
      <p>
        A great plan is nothing without concrete actions, please select an action below
        <b-icon pack="fas" icon="level-down-alt" />
      </p>
    </div>

    <div class="columns">
      <div class="column is-one-quarter" v-for="data in actions" :key="data.id">

        <div class="card action-card" :class="{ editable: editMode, selected: data.selected }" @click="clickAction(data)">
          <div class="card-image">
            <figure class="image">
              <img :src="data.image" alt="Placeholder image">
            </figure>
          </div>
          <div class="card-content">
            <div class="media">
              <div class="media-content">
                <p class="subtitle ellipsis">{{ data.text }}</p>
                <!--<p class="subtitle">@johnsmith</p>-->
              </div>
            </div>
            <span class="border"></span>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

interface ActionData {
  id: string;
  text: string;
  image: string;
  selected?: boolean;
  shaded?: boolean;
}

export default Vue.extend({
  props: {
    actions: {
      type: Array as () => ActionData[],
      required: true
    },
    editMode: Boolean
  },
  methods: {
    clickAction(action: ActionData) {
      if (this.editMode) {
        this.$emit("edit", action);
      } else {
        this.$emit("select", action);
        this.selectOne(action);
      }
    },
    selectOne(action: ActionData) {
      const focusMode = !!!action.selected;
      this.actions.map(a => {
        if (focusMode) {
          // only focus one
          const goodOne = a.id === action.id;
          a.selected = goodOne;
          a.shaded = !goodOne;
        } else {
          // reset values of all
          a.selected = false;
          a.shaded = false;
        }
      });
    }
  }
});

export { ActionData };
</script>

<style lang="scss">
@import "../assets/shared";
.actions-wrapper {
  h2.title {
    border-bottom: 0.2rem solid $color-accent;
    display: inline-block;
    margin-bottom: 1rem;
    & + p {
      margin-bottom: 2rem;
    }
  }
  & > .columns {
    flex-wrap: wrap;
  }
  .background.fade-leave-active.fade-leave-to {
    display: none;
  }
}
.action-card {
  cursor: pointer;
  transition: all 0.4s;
  .card-content {
    padding: 1rem 1rem 0.3rem;
  }
  .card-image .image {
    $size: 6rem;
    height: $size;
    width: $size;
    margin: auto;
    img {
      padding-top: 0.9rem;
    }
  }
  .media-content p {
    width: calc(100% - 1rem);
    text-align: center;
  }
  .border {
    background-color: $color-shade-alt;
    height: 0.3rem;
    position: absolute;
    bottom: 0;
    width: 100%;
    left: 0;
    transition: background-color 0.4s;
  }
  &:hover .border {
    background-color: $color-accent-alt;
  }
  &.selected .border,
  &.selected:hover .border {
    background-color: $color-accent;
  }
  &.shaded {
    opacity: 0.5;
    filter: grayscale(100%);
    &:hover {
      opacity: 0.7;
      filter: grayscale(60%);
    }
  }
}
</style>
 