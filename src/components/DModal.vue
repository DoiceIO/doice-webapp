<template>
  <div
    v-if="$store.state.nav.modal"
    ref="modal"
    class="modal flex items-center justify-center"
  >
    <div class="modal__box-container w-full" style="max-width:600px">
      <div
        class="modal__box bg-dark-5 shadow-reg scrollbar overflow-auto text-gray-300"
      >
        <button
          v-if="!$store.state.nav.modalData.noclose"
          @click="close"
          class="btn btn-close"
        >
          <i class="material-icons">close</i>
        </button>

        <!-- Join room -->
        <section v-if="$store.state.nav.modal === 'join-room'">
          <JoinRoom />
        </section>

        <!-- Add New Video Player -->
        <section v-if="$store.state.nav.modal === 'add-video-player'">
          <AddVideoPlayer />
        </section>

        <!-- Add Video To Existing Player -->
        <section v-else-if="$store.state.nav.modal === 'add-video-to-player'">
          <AddVideoToPlayer />
        </section>

        <!-- Change Username -->
        <section v-else-if="$store.state.nav.modal === 'change-username'">
          <ChangeUsername />
        </section>
      </div>
    </div>
    <div @click="close" class="modal__bg"></div>
  </div>
</template>

<script>
import JoinRoom from "./modals/JoinRoom";
import AddVideoPlayer from "./modals/AddVideoPlayer";
import AddVideoToPlayer from "./modals/AddVideoToPlayer";
import ChangeUsername from "./modals/ChangeUsername";

export default {
  components: {
    JoinRoom,
    AddVideoPlayer,
    AddVideoToPlayer,
    ChangeUsername
  },

  mounted() {
    window.addEventListener("keydown", this.onKeyDown);
  },

  watch: {
    async "$store.state.nav.modal"(modalName) {
      if (modalName) {
        await this.$nextTick();
        const input = this.$refs.modal.querySelector("input");
        if (input) input.focus();
      }
    }
  },

  methods: {
    onKeyDown(e) {
      if (e.keyCode === 27 && this.$store.state.nav.modal) {
        this.close();
      }
    },

    close() {
      if (this.$store.state.nav.modalData.noclose) return;
      this.$store.dispatch("nav/hideModal");
    }
  }
};
</script>

<style lang="scss">
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 1030;

  &__box {
    padding: 20px;
    position: relative;
    border-radius: 4px;
    max-height: 75vh;
    box-sizing: border-box;

    .btn-close {
      font-weight: bold;
      color: white;
      background: black;
      height: 24px;
      width: 24px;
      border-radius: 4px;
      position: absolute;
      right: 10px;
      top: 10px;
    }

    &-container {
      position: fixed;
      z-index: 1030;
      padding: 1rem;
      margin: auto;
    }
  }

  &__bg {
    background: rgba(0, 0, 0, 0.5);
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1029;
  }
}
</style>
