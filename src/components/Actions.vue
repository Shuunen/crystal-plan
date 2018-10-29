<template>
  <div class="actions-wrapper">

    <div class="col start content is-medium">
      <h2 class="title">Welcome</h2>
      <p>
        <strong>Crystal Plan</strong> is an online app designed to build and present a plan or strategy.
      </p>
      <p>
        The <span class="highlight">chart above</span> shows the actors of this plan : persons, ideas, values, anything.
        Because a great plan is nothing without concrete things to do, you will find <span class="highlight">actions below</span> :
      </p>
      <div class="actions-list columns is-desktop is-mobile is-multiline">
        <div class="column" v-for="data in actions" :key="data.id" @click="clickAction(data)">
          <div class="action line start">
            <div class="icon" v-if="data.image">
              <img :src="data.image" alt="action image">
            </div>
            <div class="text ellipsis" v-if="data.text">
              {{ data.text }}
            </div>
            <div class="arrow">
              <b-icon pack="fas" :icon="editMode ? 'edit' : 'chevron-right'" />
            </div>
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
}

export default Vue.extend({
  props: {
    actions: {
      type: Array as () => ActionData[],
      required: true
    },
    editMode: Boolean
  },
  data() {
    return {
      activeTab: null
    };
  },
  methods: {
    clickAction(action: ActionData) {
      if (this.editMode) {
        this.$emit("edit", action);
      } else {
        this.$emit("select", action);
      }
    }
  }
});

export { ActionData };
</script>

<style lang="scss">
@import "../assets/shared";
.actions-wrapper {
  max-width: 970px;
  h2.title {
    border-bottom: 0.2rem solid $color-accent;
    display: inline-block;
    margin-bottom: 2rem;
  }
  & > .columns {
    flex-wrap: wrap;
  }
  .background.fade-leave-active.fade-leave-to {
    display: none;
  }
}
.actions-list {
  padding-top: 0.6rem;
}
.action {
  min-width: 33vw;
  padding: 0.7rem 1rem;
  color: $color-shade-alt;
  border: 2px solid currentColor;
  align-items: center;
  transition: color 0.4s;
  cursor: pointer;
  .icon,
  .text {
    margin-right: 0.6rem;
  }
  .text {
    color: $color-primary;
  }
  .arrow {
    margin-top: .2rem;
    margin-left: auto;
    transition: color 0.2s, transform .2s;
  }
  &:hover {
    &,
    .arrow {
      color: $color-accent;
    }
    .arrow {
      transform: scale(1.2);
    }
  }
}
</style>
 