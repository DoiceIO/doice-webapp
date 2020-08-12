<template>
  <div>
    <h1 class="text-2xl text-grey-400 mb-2">Player Queue</h1>
    <form @submit.prevent="onSubmit" class="flex mb-4">
      <d-input
        v-model="url"
        placeholder="Add a YouTube, Twitch, or .mp4 video URL"
        class="flex-grow mr-2"
      />
      <d-btn variant="primary" type="submit" class="h-full">Add</d-btn>
    </form>
    <ul class="queue list-style-none overflow-y-auto">
      <!-- Data object here is the video stream object for this player -->
      <li v-for="(video, i) in queue" :key="i" class="flex items-center mb-1 rounded p-1">
        <div class="flex flex-grow">
          <!-- Video Image -->
          <div class="relative flex-shrink-0 mr-2 rounded" style="max-width:12rem">
            <img :src="getVideoThumbnail(video)" class="w-full h-full rounded" />
            <div v-if="video.data">
              <small
                v-if="video.data.duration"
                class="absolute bg-black-700 px-1 rounded-br"
                style="bottom:0;right:0;"
              >{{ video.data.duration }}</small>
            </div>
          </div>

          <!-- Video Metadata -->
          <div class="flex flex-col justify-center">
            <h3 class="text-lg font-bold break-all">{{ getVideoTitle(video) | truncate(64) }}</h3>
            <div v-if="video.data">
              <small
                v-if="video.data.publishedAt"
                class="mb-1"
              >Uploaded on {{ video.data.publishedAt | formatDate }}</small>
            </div>

            <!-- Video Actions -->
            <div>
              <d-btn
                v-if="i > 0"
                @click="$store.dispatch('room/removeVideoPlayerFromVideoPlayerQueue', { id: stream.id, queueId: queueIds[i] })"
                variant="none"
                size="xs"
                class="bg-red-400 text-xs"
              >
                <i class="material-icons">delete</i> Remove
              </d-btn>
              <d-btn
                v-if="i === 0"
                @click="$store.dispatch('room/removeVideoPlayerFromVideoPlayerQueue', { id: stream.id, queueId: queueIds[0] })"
                variant="none"
                size="xs"
                class="bg-blue-400 text-xs"
              >
                <i class="material-icons">skip_next</i> Skip Video
              </d-btn>
              <i v-if="i === 0" class="text-sm">(Currently playing)</i>
            </div>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data: () => ({
    url: ""
  }),

  computed: {
    stream() {
      return this.$store.state.nav.modalData;
    },

    queue() {
      return Object.values(this.stream.queue);
    },

    queueIds() {
      return Object.keys(this.stream.queue);
    }
  },

  methods: {
    onSubmit() {
      this.$store.dispatch("room/addVideoToVideoPlayerQueue", {
        id: this.stream.id,
        videoUrl: this.url
      });
      this.url = "";
    },

    getVideoTitle(video) {
      // YouTube, DailyMotion, and Vimeo will generally fit this requirement
      if (video.data && video.data.title) {
        return video.data.title;
      }

      if (video.type === "twitch") {
        return `Twitch: ${video.videoId}`;
      }

      if (video.type === "directUrl") {
        return `Direct URL: ${video.videoId}`;
      } else {
        return `Error, this video type is invalid`;
      }
    },

    getVideoThumbnail(video) {
      switch (video.type) {
        case "youtube":
          return `https://i.ytimg.com/vi/${video.videoId}/mqdefault.jpg`;
        case "dailymotion":
          return `https://dailymotion.com/thumbnail/video/${video.videoId}`;
        case "twitch":
          return `https://static-cdn.jtvnw.net/previews-ttv/live_user_${video.videoId}-440x248.jpg`;
        default:
          return "https://lh3.googleusercontent.com/proxy/L4zWa_ccM8ZavUzvwYeeKNmtRC9VcI5umcMBB5qqzsHxGEGziChFV1QrKe1hwP9Gst0pEfnPX1HpCCD-LPI0oJCJOkAsSdA";
      }
    }
  }
};
</script>

<style>
</style>