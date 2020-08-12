<template>
  <div class="h-full w-full">
    <video
      :id="stream.id"
      :src="activeVideoId"
      ref="video"
      frameborder="0"
      class="w-full h-full"
      autoplay
      muted
      playsinline
      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
    />
  </div>
</template>

<script>
import API from "@/api";

export default {
  props: {
    stream: {
      type: Object,
      required: true
    },
    playerData: {
      type: Object,
      required: true
    }
  },

  data: () => ({
    interval: null
  }),

  computed: {
    activeVideoId() {
      return this.stream.queue[this.playerData.activeQueueId].videoId;
    },

    player() {
      return this.$refs.video;
    }
  },

  mounted() {
    this.player.currentTime = this.stream.time;
    this.$emit("updatePlayerData", { time: this.stream.time });
    this.player.play();

    this.player.addEventListener("waiting", this.onWaiting);
    this.player.addEventListener("playing", this.onPlaying);
    this.player.addEventListener("seeked", this.onSeeked);

    // If brand new player
    if (this.stream.state === -1) {
      this.$store.commit("room/SET_VIDEO_STREAM_STATE", {
        stream: this.stream,
        newState: 1
      });
    }

    // If player is paused, pause it
    else if (this.stream.state === 2) {
      this.player.pause();
    }

    this.interval = setInterval(() => {
      const time = this.player.currentTime;
      const duration = this.player.duration;

      // If video just ended
      if (duration !== 0 && time >= duration) {
        this.$emit("skipVideo", 0);
      }

      this.$emit("updatePlayerData", { duration, time });
    }, 1000);
  },

  beforeDestroy() {
    clearInterval(this.interval);
  },

  watch: {
    "stream.time"(time) {
      this.player.currentTime = time;
    },
    "playerData.volume"(volume) {
      this.player.volume = volume / 100;
    },
    "playerData.isMuted"(isMuted) {
      this.player.muted = isMuted;
    },
    "stream.state"(state) {
      if (state === 2) this.player.pause();
      else this.player.play();
    },
    "playerData.activeQueueId"(queueId) {
      if (!queueId) return;
      this.player.src = this.stream.queue[queueId].videoId;
    },
    "stream.isBuffering"(isBuffering) {
      if (isBuffering) this.player.pause();
      else this.player.play();
    }
  },

  methods: {
    async onWaiting() {
      this.$emit("updatePlayerData", { isBuffering: true });
      const res = await API.video.buffer({
        roomId: this.$store.state.room.roomId,
        id: this.stream.id,
        isBuffering: true
      });
    },

    async onPlaying() {
      this.$emit("updatePlayerData", { isBuffering: false });
      const res = await API.video.buffer({
        roomId: this.$store.state.room.roomId,
        id: this.stream.id,
        isBuffering: false
      });
    },

    onSeeked() {
      this.onPlaying();
    }
  }
};
</script>

<style>
</style>