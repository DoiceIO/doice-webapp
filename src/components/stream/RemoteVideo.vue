<template>
  <div class="video relative">
    <video autoplay controls playsinline ref="video" class="w-full h-full bg-black rounded-lg" />
    <div class="absolute top-0 left-0 w-16 h-16 md:w-24 md:h-24 m-2">
      <RemoteWebcam v-if="usersWebcam" :stream="usersWebcam" no-username />
    </div>
  </div>
</template>

<script>
import RemoteWebcam from "./RemoteWebcam";

export default {
  components: {
    RemoteWebcam
  },

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

    audioConsumer() {
      if (!this.stream.audio) return {};
      return this.$store.state.room.consumers[this.stream.audio.producerId];
    },

    usersWebcam() {
      const producerId = this.$store.state.chat.users[this.stream.socketId]
        .producerIds.webcam;

      const consumer = this.$store.state.room.consumers[producerId];
      if (!producerId || !consumer) return undefined;
      const find = s => s.producerId === producerId;
      return this.$store.state.room.streams.webcam.find(find);
    }
  },

  async mounted() {
    let tracks = [this.consumer.track, this.audioConsumer.track];
    tracks = tracks.filter(t => t);
    this.$refs.video.srcObject = new MediaStream(tracks);
  }
};
</script>
