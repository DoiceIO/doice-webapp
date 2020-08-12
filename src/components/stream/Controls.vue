<template>
  <div class="flex justify-between p-2 bg-gray-700">
    <!-- Left side controls -->
    <div class="flex justify-between">
      <d-copy :text="roomUrl" variant="none">
        <span class="material-icons mr-2 text-dark-1">share</span>
      </d-copy>
    </div>

    <!-- Middle controls -->
    <div class="flex justify-center">
      <div class="controls flex">
        <!-- Mute Microphone -->
        <button
          v-if="!$store.state.room.localStreams.mic"
          @click="$store.dispatch('room/produceMic')"
          :disabled="!!room.activeProduceHandshakeType"
        >
          <span class="material-icons">mic</span>
        </button>
        <button
          v-else
          @click="$store.dispatch('room/stopProduceMic')"
          class="text-red-700"
        >
          <span class="material-icons">mic_off</span>
        </button>

        <!-- Webcam -->
        <button
          v-if="!room.localStreams.webcam"
          @click="$store.dispatch('room/produceWebcam')"
          :disabled="!!room.activeProduceHandshakeType"
        >
          <span class="material-icons">videocam</span>
        </button>
        <button
          v-else
          @click="$store.dispatch('room/stopProduceWebcam')"
          class="text-red-700"
        >
          <span class="material-icons">videocam_off</span>
        </button>

        <!-- Screen Share -->
        <button
          v-if="!room.localStreams.video"
          @click="$store.dispatch('room/produceDesktop')"
          :disabled="!!room.activeProduceHandshakeType"
        >
          <span class="material-icons">screen_share</span>
        </button>
        <button
          v-else
          @click="$store.dispatch('room/stopProduceDesktop')"
          class="text-red-700"
        >
          <span class="material-icons">stop_screen_share</span>
        </button>

        <!-- Add Video Player -->
        <button
          @click="$store.dispatch('nav/showModal', { id: 'add-video-player' })"
          :disabled="room.streams.external.length > 0"
        >
          <span class="material-icons">movie</span>
        </button>
      </div>
    </div>

    <!-- Right side controls -->
    <div class="flex justify-between">
      <div class="controls flex">
        <button @click="$store.dispatch('nav/toggleChat')">
          <span class="material-icons">message</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    isAddVideoModalVisible: false
  }),

  computed: {
    roomUrl() {
      return window.location.origin + this.$route.path;
    },

    room() {
      return this.$store.state.room;
    }
  }
};
</script>

<style lang="scss">
.controls > button {
  display: flex;
  align-items: center;
  padding: 0.5rem;
}
</style>
