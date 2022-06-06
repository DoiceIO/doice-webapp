<template>
  <div>
    <h1 class="text-2xl text-grey-400 mb-2">Join Room</h1>
    <form @submit.prevent="onSubmit">
      <d-input
        v-model="username"
        label="Enter your name"
        required
        class="flex-grow mr-2 mb-4"
      />
      <d-btn
        type="submit"
        variant="none"
        class="p-btn inline-block rounded font-bold bg-dark-2 px-3 py-2"
        >Join Room</d-btn
      >
    </form>
  </div>
</template>

<script>
export default {
  data: () => ({
    username: ""
  }),

  created() {
    const username = localStorage.getItem("username");
    if (username) {
      this.username = username;
      this.onSubmit();
    }
  },

  methods: {
    async onSubmit() {
      if (!this.username) return;

      const answer = await this.$store.dispatch("room/join", {
        roomId: this.$route.params.roomId,
        username: this.username
      });
      if (!answer) {
        this.answer = "";
        return;
      }

      localStorage.setItem("username", this.username);
      this.$store.dispatch("nav/hideModal");
    }
  }
};
</script>

<style></style>
