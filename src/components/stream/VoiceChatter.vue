<template>
  <audio ref="audio" autoplay></audio>
</template>

<script>
export default {
  props: {
    stream: {
      type: Object,
      required: true
    }
  },

  computed: {
    consumer() {
      return this.$store.state.room.consumers[this.stream.producerId];
    },

    track() {
      return this.consumer.track;
    }
  },

  mounted() {
    this.$refs.audio.srcObject = new MediaStream([this.track]);
  },

  watch: {
    "stream.isPaused"(isPaused) {
      this.$refs.audio.muted = isPaused;
    }
  }
};
</script>

<style></style>
