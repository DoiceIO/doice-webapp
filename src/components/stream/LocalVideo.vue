<template>
  <div class="video">
    <video
      autoplay
      muted
      playsinline
      ref="video"
      class="w-full h-full bg-black rounded-lg object-cover"
    />
  </div>
</template>

<script>
export default {
  mounted() {
    this.$refs.video.srcObject = this.$store.state.room.localStreams.video;
  }
};
</script>

<style></style>
