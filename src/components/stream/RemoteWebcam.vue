<template>
  <video
    @contextmenu.prevent="showRemoteWebcamMenu($event)"
    autoplay
    muted
    playsinline
    ref="video"
    class="w-full h-full bg-black rounded-lg"
  />
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

  async mounted() {
    this.$refs.video.srcObject = new MediaStream([this.track]);
  },

  methods: {
    showRemoteWebcamMenu($event) {
      this.$store.commit("nav/SET_CONTEXT_MENU", {
        id: "remote-webcam",
        data: { $event, stream: this.stream }
      });
    }
  }
};
</script>
