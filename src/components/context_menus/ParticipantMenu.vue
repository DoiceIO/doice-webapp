<template>
  <div>
    <div
      v-if="
        user.producerIds.mic ||
          user.producerIds.video ||
          user.producerIds.webcam
      "
      class="pb-3"
    >
      <li class="text-xs pb-1">
        {{ user.username }}
      </li>
      <div v-if="user.producerIds.mic">
        <d-context-menu-item
          v-if="consumers[user.producerIds.mic]"
          @click="toggleMic"
        >
          Mute
        </d-context-menu-item>
        <d-context-menu-item v-else @click="toggleMic">
          Unmute
        </d-context-menu-item>
      </div>

      <div v-if="user.producerIds.video">
        <d-context-menu-item
          v-if="consumers[user.producerIds.video]"
          @click="toggleVideo"
        >
          Disable Video
        </d-context-menu-item>
        <d-context-menu-item v-else @click="toggleVideo">
          Enable Video
        </d-context-menu-item>
      </div>

      <div v-if="user.producerIds.webcam">
        <d-context-menu-item
          v-if="consumers[user.producerIds.webcam]"
          @click="toggleWebcam"
        >
          Disable Webcam
        </d-context-menu-item>
        <d-context-menu-item v-else @click="toggleWebcam">
          Enable Webcam
        </d-context-menu-item>
      </div>
    </div>

    <!-- <li class="text-xs pb-1">Admin</li>
    <d-context-menu-item>Change Role</d-context-menu-item>
    <d-context-menu-item>Ban</d-context-menu-item> -->
  </div>
</template>

<script>
export default {
  computed: {
    socketId() {
      return this.$store.state.nav.contextMenuData.socketId;
    },

    user() {
      return this.$store.state.chat.users[this.socketId];
    },

    consumers() {
      return this.$store.state.room.consumers;
    }
  },

  methods: {
    toggleMic() {
      this.$store.dispatch("room/toggleConsume", this.user.producerIds.mic);
    },

    toggleVideo() {
      this.$store.dispatch("room/toggleConsume", this.user.producerIds.video);
      this.$store.dispatch("room/toggleConsume", this.user.producerIds.audio);
    },

    toggleWebcam() {
      this.$store.dispatch("room/toggleConsume", this.user.producerIds.webcam);
    }
  }
};
</script>

<style></style>
