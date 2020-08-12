<template>
  <div class="flex justify-center">
    <div class="text-gray-300 bg-dark-5 p-3 mt-6 rounded-md w-full max-w-128">
      <h1 class="text-2xl font-bold">Create a Doice room</h1>
      <form @submit.prevent="createRoom">
        <d-input
          v-model="name"
          required
          label="Enter your name"
          class="w-full mt-2 mb-4"
        />
        <d-btn
          type="submit"
          variant="none"
          class="p-btn inline-block rounded font-bold bg-dark-2 px-3 py-2"
          >Create a Room</d-btn
        >
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    name: ""
  }),

  methods: {
    async createRoom() {
      if (!this.name) return;
      // TODO this will be set on the server side
      const roomId = Math.random()
        .toString(36)
        .substr(2, 9);
      const res = await this.$store.dispatch("room/join", {
        roomId,
        username: this.name
      });
      if (!res) return;
      this.$router.push(`/${roomId}`);
    }
  }
};
</script>

<style></style>
