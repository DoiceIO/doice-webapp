<template>
  <div :id="stream.id" class="w-full h-full"></div>
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
    player: null
  }),

  computed: {
    activeVideoId() {
      return this.stream.queue[this.playerData.activeQueueId].videoId;
    }
  },

  async mounted() {
    this.player = new Twitch.Embed(this.stream.id, {
      channel: this.activeVideoId,
      allowfullscreen: false,
      layout: "video",
      theme: "dark",
      width: "100%",
      height: "100%",
      controls: false
    });

    this.player.setVolume(this.playerData.volume);

    // If brand new player
    if (this.stream.state === -1) {
      this.$store.commit("room/SET_VIDEO_STREAM_STATE", {
        stream: this.stream,
        newState: 1
      });
    }

    await API.video.buffer({
      roomId: this.$store.state.room.roomId,
      id: this.stream.id,
      isBuffering: false
    });
  },

  // Hook into player data events
  watch: {
    "stream.time"(time) {
      // Unused for now since Twitch is live
    },
    "playerData.volume"(volume) {
      this.player.setVolume(volume / 100);
      if (volume > 0) this.playerData.isMuted = false;
      else this.playerData.isMuted = true;
    },
    "playerData.isMuted"(isMuted) {
      this.player.setMuted(isMuted);
    },
    "stream.state"(state) {
      if (state === 2) this.player.pause();
      else this.player.play();
    },
    "playerData.activeQueueId"(queueId) {
      if (!queueId) return;
      this.player.setChannel(this.stream.queue[queueId].videoId);
    },
    "stream.isBuffering"() {
      // TODO This is lazy and temporary fix. Live streams like twitch should not
      // even use the buffering api
      this.player.play();
    }
  }
};
</script>

<style></style>
