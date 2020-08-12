<template>
  <video
    autoplay
    muted
    playsinline
    ref="video"
    class="bg-black rounded-lg object-cover"
  />
</template>

<script>
export default {
  mounted() {
    this.$refs.video.srcObject = this.$store.state.room.localStreams.webcam;
  }
};
</script>

<style></style>
