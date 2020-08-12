<template>
  <video
    autoplay
    muted
    playsinline
    ref="video"
    class="rounded-full object-cover w-12 h-12"
    :class="videoStyling"
  />
</template>

<script>
export default {
  props: {
    videoStyling: String
  },

  mounted() {
    this.$refs.video.srcObject = this.$store.state.room.localStreams.webcam;
  }
};
</script>

<style></style>
