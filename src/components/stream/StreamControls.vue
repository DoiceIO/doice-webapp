<template>
  <div
    @mouseenter="controls = true"
    @mouseleave="controls = false"
    @mousemove="onMouseMove"
    class="h-full w-full relative bg-black rounded-lg"
    :style="`cursor: ${controls ? 'default' : 'none'}`"
  >
    <!-- Video player / Empty queue controls -->
    <div v-show="isVideo || stream.type === 'twitch'" class="w-full h-full">
      <slot></slot>
    </div>
    <div
      v-if="!isVideo"
      class="flex items-center justify-center text-center h-full w-full text-gray-300"
    >
      <div class="flex flex-col items-center">
        <div class="mb-2">
          <!-- <p-icon icon="fab fa-youtube text-2xl pr-2" style="color:#FE0200;" />
          <p-icon icon="fab fa-dailymotion text-2xl" style="color:rgb(40, 179, 200);" />-->
          <h2 class="text-2xl font-bold">The Queue is Empty</h2>
          <p>Add videos to the queue to continue watching!</p>
        </div>
        <div class="flex">
          <d-btn @click="showAddVideoModal" variant="none" class="bg-green-700 mr-2">
            <i class="material-icons">add</i> Add Video
          </d-btn>
          <d-btn
            @click="
              $store.dispatch('room/removeVideoPlayer', { id: stream.id })
            "
            variant="none"
            class="bg-red-400"
          >
            <i class="material-icons">remove</i> Remove Player
          </d-btn>
        </div>
      </div>
    </div>

    <!-- Video Controls Center Overlay -->
    <div
      v-if="pc.center && controls && queue.length"
      class="controls absolute flex"
      style="left:50%;top:50%;transform:translate(-50%,-50%)"
    >
      <d-btn
        v-if="pc.center.addVideo"
        @click="showAddVideoModal"
        variant="none"
        size="sm"
        class="bg-green-700 mr-1 text-xs lg:text-base"
      >
        <i class="material-icons">add</i> Add Video
      </d-btn>
      <d-btn
        v-if="pc.center.skipVideo && queue.length"
        @click="$emit('skipVideo', queueIds[0])"
        variant="none"
        size="sm"
        class="bg-blue-400 mr-1 text-xs lg:text-base"
      >
        <i class="material-icons">skip_next</i> Skip Video
      </d-btn>
      <d-btn
        v-if="pc.center.removePlayer"
        @click="$store.dispatch('room/removeVideoPlayer', { id: stream.id })"
        variant="none"
        size="sm"
        class="bg-red-400 text-xs lg:text-base"
      >
        <i class="material-icons">remove</i> Remove Player
      </d-btn>
    </div>

    <!-- Video Down Controls -->
    <div
      v-if="pc.downBar && controls && queue.length"
      class="w-full bg-dark-4 absolute bottom-0 left-0"
    >
      <div class="relative w-full h-full">
        <input
          v-if="pc.downBar.skim"
          type="range"
          @input="$emit('timeChange', $event)"
          min="0"
          :value="playerData.time"
          :max="playerData.duration"
          class="absolute left-0 w-full h-4"
          style="top:-0.5rem"
        />
      </div>
      <div class="flex items-center">
        <div>
          <d-btn v-if="stream.state === 1" @click="onPause" variant="none">
            <i class="material-icons">pause</i>
          </d-btn>
          <d-btn v-else @click="onPlay" variant="none">
            <i class="material-icons">play_arrow</i>
          </d-btn>
        </div>
        <div @mouseenter="showVolume" @mouseleave="hideVolume" class="flex items-center">
          <d-btn @click="toggleMute" variant="none" class="w-12">
            <i v-if="playerData.isMuted" class="material-icons">volume_off</i>
            <i v-else-if="playerData.volume < 50" class="material-icons">volume_down</i>
            <i v-else class="material-icons">volume_up</i>
          </d-btn>
          <input
            v-if="playerData.showVolume"
            :value="playerData.volume"
            @input="updateVolume($event)"
            type="range"
            class="w-24"
            min="0"
            max="100"
          />
        </div>
        <span
          v-if="pc.downBar.time"
          class="ml-2 text-xs text-gray-300"
        >{{ playerData.time | formatTime }} / {{ playerData.duration | formatTime }}</span>
        <div class="flex-grow"></div>
        <d-btn @click="$emit('toggleFullscreen')" variant="none">
          <i class="material-icons">fullscreen</i>
        </d-btn>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

import playerControls from "@/data/playerControls";

const regex = {
  youtubeUrl: /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/,
  dailymotionUrl: /https?:\/\/(www.)?(dailymotion.com|dai.ly)(\/video)?\/(.{7})/
};

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
    controls: false,
    isAddVideo: false,
    url: "",
    idleMouseTimeout: null
  }),

  computed: {
    queue() {
      return Object.values(this.stream.queue) || [];
    },

    queueIds() {
      return Object.keys(this.stream.queue) || [];
    },

    pc() {
      if (!this.queue.length) return {};
      return playerControls[this.queue[0].type];
    },

    isVideo() {
      return this.queue.length;
    }
  },

  beforeDestroy() {
    if (this.idleMouseTimeout) {
      clearTimeout(this.idleMouseTimeout);
    }
  },

  methods: {
    addVideo() {
      if (!this.url) return;
      this.$emit("addVideo", this.url);
    },

    onPlay() {
      this.$emit("play");
    },

    onPause() {
      this.$emit("pause");
    },

    showVolume() {
      this.$emit("updatePlayerData", { showVolume: true });
    },

    hideVolume() {
      this.$emit("updatePlayerData", { showVolume: false });
    },

    toggleMute() {
      this.$emit("updatePlayerData", { isMuted: !this.playerData.isMuted });
    },

    updateVolume(event) {
      this.$emit("updatePlayerData", { volume: event.target.value });
    },

    showAddVideoModal() {
      this.$store.dispatch("nav/showModal", {
        id: "add-video-to-player",
        data: this.stream
      });
    },

    onMouseMove(event) {
      if (this.idleMouseTimeout) {
        clearTimeout(this.idleMouseTimeout);
      }
      this.controls = true;
      this.idleMouseTimeout = setTimeout(() => {
        this.controls = false;
      }, 3000);
    }
  }
};
</script>

<style lang="scss" scoped>
.queue {
  li:nth-child(even) {
    @apply bg-dark-4;
  }
}
input[type="range"] {
  -webkit-appearance: none; /* Hides the slider so that custom slider can be made */
  width: 100%; /* Specific width is required for Firefox. */
  background: transparent; /* Otherwise white in Chrome */
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
}

input[type="range"]:focus {
  outline: none; /* Removes the blue border. You should probably do some kind of focus styling for accessibility reasons though. */
}

input[type="range"]::-ms-track {
  width: 100%;
  cursor: pointer;

  /* Hides the slider so custom styles can be added */
  background: transparent;
  border-color: transparent;
  color: transparent;
}
/* Special styling for WebKit/Blink */
input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  height: 1rem;
  width: 1rem;
  border-radius: 50%;
  background: #009dee;
  cursor: pointer;
  margin-top: -0.37rem; /* You need to specify a margin in Chrome, but in Firefox and IE it is automatic */
}

/* All the same stuff for Firefox */
input[type="range"]::-moz-range-thumb {
  height: 1rem;
  width: 1rem;
  border-radius: 50%;
  background: #009dee;
  cursor: pointer;
}
input[type="range"]::-webkit-slider-runnable-track {
  width: 100%;
  height: 0.3rem;
  cursor: pointer;
  background: #f3f3f3;
  border-radius: 1.3px;
}

input[type="range"]::-moz-range-track {
  width: 100%;
  height: 0.3rem;
  cursor: pointer;
  background: #f3f3f3;
  border-radius: 1.3px;
}

input[type="range"]::-ms-track {
  width: 100%;
  height: 0.3rem;
  cursor: pointer;
  background: #f3f3f3;
  color: transparent;
}
input[type="range"]::-ms-fill-lower {
  background: #009dee;
  border: 0.2px solid #010101;
}
input[type="range"]::-ms-fill-upper {
  background: #f3f3f3;
}
</style>
