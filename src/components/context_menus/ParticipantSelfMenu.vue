<template>
  <div>
    <div class="pb-3">
      <li class="text-xs pb-1">
        {{ user.username }}
      </li>
      <div>
        <d-context-menu-item
          v-if="room.localStreams.mic"
          @click="$store.dispatch('room/stopProduceMic')"
        >
          Disable Mic
        </d-context-menu-item>
        <d-context-menu-item v-else @click="$store.dispatch('room/produceMic')">
          Enable Mic
        </d-context-menu-item>
      </div>

      <div>
        <d-context-menu-item
          v-if="room.localStreams.video"
          @click="$store.dispatch('room/stopProduceDesktop')"
        >
          Disable Video
        </d-context-menu-item>
        <d-context-menu-item
          v-else
          @click="$store.dispatch('room/produceDesktop')"
        >
          Enable Video
        </d-context-menu-item>
      </div>

      <div>
        <d-context-menu-item
          v-if="room.localStreams.webcam"
          @click="$store.dispatch('room/stopProduceWebcam')"
        >
          Disable Webcam
        </d-context-menu-item>
        <d-context-menu-item
          v-else
          @click="$store.dispatch('room/produceWebcam')"
        >
          Enable Webcam
        </d-context-menu-item>
      </div>
    </div>

    <div>
      <li class="text-xs pb-1">
        You
      </li>

      <d-context-menu-item
        @click="$store.dispatch('nav/showModal', { id: 'change-username' })"
      >
        Change Username
      </d-context-menu-item>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    room() {
      return this.$store.state.room;
    },

    user() {
      return this.$store.state.chat.users[
        this.$store.state.nav.contextMenuData.socketId
      ];
    }
  }
};
</script>

<style></style>
