<template>
  <div>
    <h1 class="text-2xl text-grey-400 mb-2">Add Syncronized Video Player</h1>
    <form @submit.prevent="onSubmit" class="flex">
      <d-input
        v-model="url"
        placeholder="Enter a YouTube, Twitch, or .mp4 video URL"
        class="flex-grow mr-2"
      />
      <d-btn variant="primary" type="submit" class="h-full">Add</d-btn>
    </form>
  </div>
</template>

<script>
export default {
  data: () => ({
    url: ""
  }),

  methods: {
    onSubmit() {
      this.$store.dispatch("room/addVideoPlayer", this.url);
      this.$store.dispatch("nav/hideModal");
    }
  }
};
</script>

<style>
</style>