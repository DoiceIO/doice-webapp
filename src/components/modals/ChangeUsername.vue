<template>
  <div>
    <h1 class="text-2xl text-grey-400 mb-2">Change Name</h1>
    <form @submit.prevent="onSubmit">
      <d-input
        v-model="username"
        label="Enter your new name"
        required
        class="flex-grow mr-2 mb-4"
      />
      <d-btn
        type="submit"
        variant="none"
        class="p-btn inline-block rounded font-bold bg-dark-2 px-3 py-2"
        >Change Name</d-btn
      >
    </form>
  </div>
</template>

<script>
export default {
  data: () => ({
    username: ""
  }),

  mounted() {
    this.username = this.$store.state.room.username;
  },

  methods: {
    async onSubmit() {
      if (!this.username) return;

      const answer = await this.$store.dispatch("room/changeUsername", {
        username: this.username
      });

      localStorage.setItem("username", this.username);
      this.$store.dispatch("nav/hideModal");
    }
  }
};
</script>

<style></style>
