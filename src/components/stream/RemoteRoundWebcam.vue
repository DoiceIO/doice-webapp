<template>
  <div class="video">
    <div class="w-16 h-16 md:w-24 md:h-24 lg:w-32 lg:h-32 mx-2">
      <RemoteWebcam
        :stream="stream"
        class="h-full w-full object-cover rounded-full overflow-hidden"
      />
    </div>
    <div
      v-if="!noUsername"
      class="text-center text-xl text-gray-600 font-bold"
    >{{ $store.state.chat.users[stream.socketId].username }}</div>
  </div>
</template>

<script>
import RemoteWebcam from "./RemoteWebcam";

export default {
  components: {
    RemoteWebcam
  },

  props: {
    stream: {
      type: Object,
      required: true
    },
    noUsername: {
      type: Boolean,
      default: false
    }
  }
};
</script>
