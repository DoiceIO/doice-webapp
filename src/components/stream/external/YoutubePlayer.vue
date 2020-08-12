<template>
  <div class="h-full w-full">
    <div
      :id="stream.id"
      frameborder="0"
      class="w-full h-full"
      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
    ></div>
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
    player: null,
    interval: null
  }),

  mounted() {
    this.startedAt = Date.now();
    this.player = new YT.Player(this.stream.id, {
      videoId: Object.values(this.stream.queue)[0].videoId,
      playerVars: {
        autoplay: 0,
        controls: 0,
        disablenewui: 1,
        modestbranding: 1,
        playsinline: 1
      },
      events: {
        onReady: this.onReady,
        onStateChange: this.onPlayerStateChange
      }
    });
  },

  beforeDestroy() {
    clearInterval(this.interval);
  },

  // Hook into player data events
  watch: {
    "stream.time"(time) {
      this.player.seekTo(time);
    },
    "playerData.volume"(volume) {
      this.player.setVolume(volume);
      if (volume > 0) this.playerData.isMuted = false;
      else this.playerData.isMuted = true;
    },
    "playerData.isMuted"(isMuted) {
      if (isMuted) this.player.mute();
      else this.player.unMute();
    },
    "stream.state"(state) {
      if (state == 2) this.player.pauseVideo();
      else this.player.playVideo();
    },
    "playerData.activeQueueId"(queueId) {
      if (!queueId) return;
      this.player.loadVideoById(this.stream.queue[queueId].videoId);
    },
    "stream.isBuffering"(isBuffering) {
      if (isBuffering) this.player.pauseVideo();
      else if (this.stream.state !== 2) this.player.playVideo();
    }
  },

  methods: {
    onReady() {
      // Mute video due to autoplaying with sound block
      this.player.setVolume(0);
      this.player.isMuted = true;

      this.player.seekTo(this.stream.time);
      this.$emit("updatePlayerData", { time: this.stream.time });
      this.player.playVideo();

      // If brand new player
      if (this.stream.state === -1) {
        this.$store.commit("room/SET_VIDEO_STREAM_STATE", {
          stream: this.stream,
          newState: 1
        });
      }

      // If video is playing, update time
      else if (this.stream.state === 1) {
        this.$store.commit("room/SET_VIDEO_STREAM_TIME", {
          stream: this.stream,
          time: this.stream.time + (Date.now() - this.startedAt) / 1000
        });
      }

      // If player is paused, pause it
      else if (this.stream.state === 2) {
        this.player.pauseVideo();
      }

      // Unmute player
      this.player.isMuted = false;
      this.player.setVolume(this.playerData.volume);

      // Add interval to update video / player data
      this.interval = setInterval(() => {
        const time = this.player.getCurrentTime();
        const duration = this.player.getDuration();

        // If video has just ended
        if (duration !== 0 && time >= duration) {
          this.$emit("skipVideo", 0);
        }

        this.$emit("updatePlayerData", { duration, time });
      }, 1000);
    },

    async onPlayerStateChange(event) {
      if (event.data === 3) {
        this.$emit("updatePlayerData", { isBuffering: true });
        const res = await API.video.buffer({
          roomId: this.$store.state.room.roomId,
          id: this.stream.id,
          isBuffering: true
        });
      } else if (
        (event.data === 1 || event.data === 2) &&
        this.playerData.isBuffering
      ) {
        this.$emit("updatePlayerData", { isBuffering: false });
        const res = await API.video.buffer({
          roomId: this.$store.state.room.roomId,
          id: this.stream.id,
          isBuffering: false
        });
      }
    }
  }
};
</script>