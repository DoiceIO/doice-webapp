<template>
  <div>
    <li class="text-xs pb-1">
      {{ user.username }}
    </li>
    <div>
      <d-context-menu-item
        @click="$store.dispatch('room/toggleConsume', user.producerIds.webcam)"
      >
        Disable Webcam
      </d-context-menu-item>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    room() {
      return this.$store.state.room;
    },

    user() {
      return this.$store.state.chat.users[
        this.$store.state.nav.contextMenuData.stream.socketId
      ];
    }
  }
};
</script>

<style></style>
