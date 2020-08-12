<template>
  <div class="flex flex-col h-full w-64 bg-gray-800">
    <div class="flex">
      <button
        @click="mode = 'chat'"
        class="inline-block text-gray-100 font-bold py-1 w-6/12 text-center"
        :class="mode === 'chat' ? 'bg-gray-800' : 'bg-gray-900'"
        norounded
      >
        Chat
      </button>
      <button
        @click="mode = 'participants'"
        class="inline-block text-gray-100 font-bold py-1 w-6/12 text-center"
        :class="mode === 'participants' ? 'bg-gray-800' : 'bg-gray-900'"
        norounded
      >
        Participants
      </button>
    </div>
    <div v-if="mode === 'chat'" class="flex flex-col flex-grow">
      <div
        class="flex-grow overflow-y-auto scrollbar relative"
        style="height:1px"
        ref="chat"
      >
        <ul class="list-style-none flex flex-col py-2">
          <li class="opacity-50 text-xs text-gray-300 px-2">
            Welcome to the chat, say hi and start a conversation!
          </li>
          <ChatMessage
            v-for="(message, i) in $store.state.chat.messages"
            :key="i"
            :message="message"
          />
        </ul>
      </div>
    </div>
    <div
      v-if="mode === 'participants'"
      class="flex flex-col flex-grow p-2 overflow-y-hidden"
    >
      <ul
        class="relative flex-grow scrollbar overflow-y-auto overflow-x-hidden list-style-none text-gray-300"
      >
        <ChatParticipant
          v-for="socketId in Object.keys($store.state.chat.users)"
          :key="socketId"
          :socketId="socketId"
        />
      </ul>
    </div>
    <div class="relative bg-gray-700" style="height:3.5rem">
      <div v-if="mode === 'chat'" class="w-full h-full">
        <textarea
          v-model="text"
          @keydown.prevent.enter="sendMessage"
          class="w-full h-full bg-gray-700 text-gray-300 text-xs p-1"
          placeholder="Enter a message..."
        ></textarea>
        <div class="absolute flex bottom-0 right-0 py-2 px-1 items-center">
          <d-btn
            @click="sendMessage"
            variant="primary"
            size="xs"
            :disabled="text.length > 256"
            class="text-xs px-2"
            >Send</d-btn
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ChatMessage from "./chat/ChatMessage";
import ChatParticipant from "./chat/ChatParticipant";

export default {
  components: {
    ChatParticipant,
    ChatMessage
  },

  data: () => ({
    text: "",
    mode: "chat"
  }),

  methods: {
    async doScroll() {
      await this.$nextTick();
      const chat = this.$refs.chat;
      // If not chat mode, chat element is undefined
      if (this.mode !== "chat") return;
      if (!chat.scrollTo) {
        chat.scrollTop = chat.scrollHeight;
      } else {
        chat.scrollTo({
          top: chat.scrollHeight,
          left: 0,
          behavior: "smooth"
        });
      }
    },

    sendMessage() {
      if (!this.text) return;
      this.$store.dispatch("chat/sendMessage", this.text);
      this.text = "";
    }
  },

  watch: {
    "$store.state.chat.messages"() {
      this.doScroll();
    }
  }
};
</script>
