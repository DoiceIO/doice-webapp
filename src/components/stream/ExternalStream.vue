<template>
  <div class="video">
    <StreamControls
      :stream="stream"
      :playerData="playerData"
      @addVideo="addVideo"
      @play="playVideo"
      @pause="pauseVideo"
      @skipVideo="skipVideo"
      @timeChange="timeChange"
      @toggleFullscreen="toggleFullscreen"
      @updatePlayerData="updatePlayerData"
      :id="`${stream.id}-container`"
    >
      <div
        v-show="!stream.isBuffering"
        class="h-full w-full"
        style="pointer-events:none"
      >
        <YoutubePlayer
          v-if="playerData.type === 'youtube'"
          :playerData="playerData"
          :stream="stream"
          :key="playerData.activeQueueId"
          @skipVideo="skipVideo"
          @updatePlayerData="updatePlayerData"
        />
        <TwitchPlayer
          v-else-if="playerData.type === 'twitch'"
          :playerData="playerData"
          :stream="stream"
          :key="playerData.activeQueueId"
          @updatePlayerData="updatePlayerData"
        />
        <DirectUrlPlayer
          v-else-if="playerData.type === 'directUrl'"
          :playerData="playerData"
          :stream="stream"
          :key="playerData.activeQueueId"
          @skipVideo="skipVideo"
          @updatePlayerData="updatePlayerData"
        />
      </div>
      <div
        v-show="stream.isBuffering"
        class="h-full w-full flex items-center justify-center"
      >
        <d-loader />
      </div>
    </StreamControls>
  </div>
</template>

<script>
import StreamControls from "./StreamControls";
import YoutubePlayer from "./external/YoutubePlayer";
import TwitchPlayer from "./external/TwitchPlayer";
import DirectUrlPlayer from "./external/DirectUrlPlayer";

export default {
  components: {
    StreamControls,
    YoutubePlayer,
    TwitchPlayer,
    DirectUrlPlayer
  },

  props: {
    stream: {
      type: Object,
      required: true
    }
  },

  data: () => ({
    playerData: {
      time: 0,
      duration: 0,
      activeQueueId: "",
      showVolume: false,
      volume: 50,
      isMuted: true,
      isFullscreen: false,
      type: "",
      isBuffering: true
    }
  }),

  computed: {
    queueIds() {
      return Object.keys(this.stream.queue);
    },

    queue() {
      return Object.values(this.stream.queue);
    }
  },

  created() {
    // TODO put this in its own function and depend on stream type
    // Get volume from localStorage
    const playerData = JSON.parse(localStorage.getItem("video-player"));
    if (playerData && playerData.youtube && playerData.youtube.volume) {
      this.playerData.volume = playerData.youtube.volume;
    }
    this.playerData.isMuted = this.playerData.volume === 0;

    this.playerData.time = 0;
    if (this.queue.length) {
      this.playerData.type = this.queue[0].type;
      this.playerData.activeQueueId = this.queueIds[0];
    }
  },

  watch: {
    "stream.time"(time) {
      this.playerData.time = time;
    },

    "stream.queue"() {
      // If actively playing video was removed from queue, start playing next video
      if (
        this.queueIds[0] !== this.playerData.activeQueueId &&
        this.queueIds.length
      ) {
        this.loadVideo(this.queueIds[0]);
      }

      // If no more videos left in queue
      else if (!this.queueIds.length) {
        this.playerData.activeQueueId = "";
        this.playerData.type = "";
        this.$store.commit("room/SET_VIDEO_STREAM_STATE", {
          stream: this.stream,
          newState: 2
        });
        this.$store.commit("room/SET_VIDEO_STREAM_TIME", {
          stream: this.stream,
          time: 0
        });
      }
    }
  },

  methods: {
    updatePlayerData(playerData) {
      // If volume changed
      if (playerData.volume !== this.playerData.volume) {
        localStorage.setItem(
          "video-player",
          JSON.stringify({
            youtube: { volume: Number(playerData.volume) }
          })
        );
      }
      Object.keys(playerData).forEach(key => {
        this.playerData[key] = playerData[key];
      });
    },

    addVideo(queueId, videoId) {
      this.$store.dispatch("room/addVideoToVideoPlayerQueue", {
        id: this.stream.id,
        queueId,
        videoId
      });
    },

    playVideo() {
      this.$store.dispatch("room/playVideoPlayer", {
        id: this.stream.id
      });
    },

    pauseVideo() {
      this.$store.dispatch("room/pauseVideoPlayer", {
        id: this.stream.id
      });
    },

    skipVideo(queueId) {
      // If number, assume index and get queueId at index of queue keys array
      if (typeof queueId === "number") {
        queueId = this.queueIds[queueId];
      }
      this.playerData.duration = 0;
      this.$store.dispatch("room/removeVideoPlayerFromVideoPlayerQueue", {
        id: this.stream.id,
        queueId
      });
    },

    loadVideo(queueId) {
      const video = this.stream.queue[queueId];
      if (!video) return;

      this.playerData.time = 0;
      this.playerData.type = video.type;
      this.playerData.activeQueueId = queueId;

      this.$store.commit("room/SET_VIDEO_STREAM_STATE", {
        stream: this.stream,
        newState: 1
      });
      this.$store.commit("room/SET_VIDEO_STREAM_TIME", {
        stream: this.stream,
        time: 0
      });
    },

    timeChange(event) {
      // TODO: throttle this function
      const time = Number(event.target.value);
      this.$store.dispatch("room/setVideoPlayerTime", {
        id: this.stream.id,
        time
      });
    },

    toggleFullscreen() {
      // If is in fullscreen
      if (document.fullscreenElement) {
        document.exitFullscreen();
        this.playerData.isFullscreen = false;
        return;
      }
      // If not fullscreen
      document
        .getElementById(this.stream.id + "-container")
        .requestFullscreen();
      this.playerData.isFullscreen = true;
    }
  }
};
</script>

<style></style>
