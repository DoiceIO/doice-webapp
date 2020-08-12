<template>
  <li
    @contextmenu.prevent="showParticipantMenu($event, socketId)"
    class="flex items-center mb-2 hover:bg-gray-900 rounded py-1 px-2 cursor-default"
  >
    <span class="material-icons text-base pr-1">person</span>
    <span class="flex-grow font-bold">
      {{ $store.state.chat.users[socketId].username }}
    </span>
    <div class="flex">
      <span
        v-if="isVideoDisabled"
        class="material-icons opacity-50 text-base text-red-600 w-6"
        >stop_screen_share_off</span
      >
      <span
        v-if="isWebcamDisabled"
        class="material-icons opacity-50 text-base text-red-600 w-6"
        >videocam_off</span
      >
      <span v-if="isMicMuted" class="material-icons opacity-50 text-base">
        mic_off
      </span>
      <span
        v-else-if="isMicDisabled"
        class="material-icons opacity-50 text-base text-red-600"
      >
        mic_off
      </span>
    </div>
  </li>
</template>

<script>
export default {
  props: {
    socketId: {
      type: String,
      required: true
    }
  },

  computed: {
    isLocalUser() {
      return this.socketId === window.socket.id;
    },

    isMicDisabled() {
      if (this.isLocalUser) return false;
      return this.isUserStreamOfTypeDisabledLocally("mic");
    },

    isVideoDisabled() {
      if (this.isLocalUser) return false;
      return this.isUserStreamOfTypeDisabledLocally("video");
    },

    isMicMuted() {
      if (this.isLocalUser) return !this.$store.state.room.localStreams.mic;
      return !this.$store.state.chat.users[this.socketId].producerIds.mic;
    },

    isWebcamDisabled(soketId) {
      if (this.isLocalUser) return false;
      return this.isUserStreamOfTypeDisabledLocally("webcam");
    }
  },

  methods: {
    isUserStreamOfTypeDisabledLocally(type) {
      const producerId = this.$store.state.chat.users[this.socketId]
        .producerIds[type];
      return producerId && !this.$store.state.room.consumers[producerId];
    },

    showParticipantMenu($event) {
      this.$store.commit("nav/SET_CONTEXT_MENU", {
        id: this.isLocalUser ? "participant-self" : "participant",
        data: { $event, socketId: this.socketId }
      });
    }
  }
};
</script>

<style></style>
