<template>
  <div
    ref="popper"
    v-show="isVisible"
    tabindex="-1"
    v-click-outside="close"
    @contextmenu.capture.prevent
    class="context-menu fixed overflow-hidden rounded-md bg-gray-900 text-gray-200 p-2"
  >
    <ul class="list-style-none m-0 p-2">
      <slot v-if="$store.state.nav.contextMenu === 'participant'">
        <ParticipantMenu />
      </slot>

      <slot v-else-if="$store.state.nav.contextMenu === 'participant-self'">
        <ParticipantSelfMenu />
      </slot>

      <slot v-else-if="$store.state.nav.contextMenu === 'remote-webcam'">
        <RemoteWebcamMenu />
      </slot>

      <slot v-if="$store.state.nav.contextMenu === 'default'">
        <span class="opacity-50 italic">No options</span>
      </slot>
    </ul>
  </div>
</template>

<script>
import Popper from "popper.js";
import ClickOutside from "vue-click-outside";

import ParticipantMenu from "./../context_menus/ParticipantMenu";
import ParticipantSelfMenu from "./../context_menus/ParticipantSelfMenu";
import RemoteWebcamMenu from "./../context_menus/RemoteWebcamMenu";

// @vue/component
export default {
  components: {
    Popper,
    ParticipantMenu,
    ParticipantSelfMenu,
    RemoteWebcamMenu
  },

  props: {
    boundariesElement: {
      type: String,
      default: "body"
    }
  },

  data() {
    return {
      opened: false,
      contextData: {}
    };
  },

  directives: {
    ClickOutside
  },

  computed: {
    isVisible() {
      return this.opened;
    }
  },

  watch: {
    "$store.state.nav.contextMenu"(id) {
      if (id) this.open();
      else this.close();
    }
  },

  methods: {
    open(evt, contextData) {
      evt = this.$store.state.nav.contextMenuData.$event;
      this.opened = true;
      this.contextData = contextData;

      if (this.popper) {
        this.popper.destroy();
      }

      this.popper = new Popper(this.referenceObject(evt), this.$refs.popper, {
        placement: "right-start",
        modifiers: {
          preventOverflow: {
            boundariesElement: document.querySelector(this.boundariesElement)
          }
        }
      });

      // Recalculate position
      this.$nextTick(() => {
        this.popper.scheduleUpdate();
      });
    },
    close() {
      this.opened = false;
      this.contextData = null;
      this.$store.commit("nav/SET_CONTEXT_MENU", { id: "", data: {} });
    },
    referenceObject(evt) {
      const left = evt.clientX;
      const top = evt.clientY;
      const right = left + 1;
      const bottom = top + 1;
      const clientWidth = 1;
      const clientHeight = 1;

      function getBoundingClientRect() {
        return {
          left,
          top,
          right,
          bottom
        };
      }

      const obj = {
        getBoundingClientRect,
        clientWidth,
        clientHeight
      };
      return obj;
    }
  },
  beforeDestroy() {
    if (this.popper !== undefined) {
      this.popper.destroy();
    }
  }
};
</script>

<style lang="scss" scoped>
.context-menu {
  z-index: 999;

  &:focus {
    outline: none;
  }

  ul {
    padding: 0px;
    margin: 0px;
  }
}
</style>
