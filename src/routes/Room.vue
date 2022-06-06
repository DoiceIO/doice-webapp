<template>
  <div class="flex w-full h-full">
    <div class="flex-grow overflow-hidden">
      <div
        class="relative flex justify-center flex-grow bg-gray-900 p-2"
        style="height: calc(100% - 56px)"
      >
        <div
          v-if="!smallStreams && !largeStreams"
          class="flex items-center justify-center w-full h-full text-gray-300"
        >
          <div class="w-full max-w-lg">
            <h1 class="text-2xl mb-6 leading-none">
              Welcome
              <span class="font-bold">{{ room.username }}</span>
              , here are some quick actions:
            </h1>
            <ul>
              <li v-if="!room.localStreams.mic" class="flex items-center mb-2">
                <d-btn
                  @click="$store.dispatch('room/produceMic')"
                  variant="none"
                  class="p-btn inline-block rounded font-bold bg-dark-2 px-3 py-2"
                >
                  <span class="material-icons mr-2">mic</span>
                  Capture Mic
                </d-btn>
                <span class="ml-2">Speak your mind.</span>
              </li>
              <li
                v-if="!room.localStreams.video"
                class="flex items-center mb-2"
              >
                <d-btn
                  @click="$store.dispatch('room/produceDesktop')"
                  variant="none"
                  class="p-btn inline-block rounded font-bold bg-dark-2 px-3 py-2"
                >
                  <span class="material-icons mr-2">screen_share</span>
                  Capture Desktop
                </d-btn>
                <span class="ml-2">Share your screen.</span>
              </li>
              <li
                v-if="!room.localStreams.webcam"
                class="flex items-center mb-2"
              >
                <d-btn
                  @click="$store.dispatch('room/produceWebcam')"
                  variant="none"
                  class="p-btn inline-block rounded font-bold bg-dark-2 px-3 py-2"
                >
                  <span class="material-icons mr-2">videocam</span>
                  Capture Webcam
                </d-btn>
                <span class="ml-2">Match a face to your voice.</span>
              </li>
              <li class="flex items-center mb-2">
                <d-btn
                  @click="
                    $store.dispatch('nav/showModal', { id: 'add-video-player' })
                  "
                  variant="none"
                  class="p-btn inline-block rounded font-bold bg-dark-2 px-3 py-2"
                >
                  <span class="material-icons mr-2">movie</span>
                  Add Synchronized Player
                </d-btn>
                <span class="ml-2">Watch videos together.</span>
              </li>
              <li class="flex items-center">
                <d-btn
                  @click="
                    $store.dispatch('nav/showModal', { id: 'change-username' })
                  "
                  variant="none"
                  class="p-btn inline-block rounded font-bold bg-dark-2 px-3 py-2"
                >
                  <span class="material-icons mr-2">badge</span>
                  Change Your Name
                </d-btn>
                <span class="ml-2">Legally or illegally?</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- TODO custom layouts -->

        <!-- Layout for only mics -->

        <!-- Layout for screens -->
        <div
          v-else-if="!smallStreams"
          class="flex flex-wrap md:flex-row items-center justify-center w-full h-full"
        >
          <VideoContainer class="w-full h-full">
            <RemoteVideo
              v-for="stream in enabledStreams.video"
              :key="stream.producerId"
              :stream="stream"
            />
            <ExternalStream
              v-for="stream in room.streams.external"
              :key="stream.id"
              :stream="stream"
            />
          </VideoContainer>
        </div>

        <!-- Layout for only webcams -->
        <div
          v-else-if="!largeStreams"
          class="flex flex-wrap md:flex-row items-center justify-center w-full h-full"
        >
          <VideoContainer class="w-full h-full">
            <div
              v-for="stream in enabledStreams.webcam"
              :key="stream.producerId"
              class="video"
            >
              <RemoteWebcam :stream="stream" />
            </div>
          </VideoContainer>
        </div>

        <!-- Layout for all -->
        <div v-else class="flex flex-col justify-center h-full w-full">
          <VideoContainer class="w-full">
            <RemoteVideo
              v-for="stream in enabledStreams.video"
              :key="stream.producerId"
              :stream="stream"
            />
            <ExternalStream
              v-for="stream in room.streams.external"
              :key="stream.id"
              :stream="stream"
            />
          </VideoContainer>
          <div
            class="flex justify-center flex-shrink-0 w-full overflow-x-auto py-2"
          >
            <div class="flex">
              <RemoteRoundWebcam
                v-for="stream in filteredWebcamStreams"
                :key="stream.producerId"
                :stream="stream"
              />
            </div>
          </div>
        </div>

        <!-- Local Streams -->
        <div class="absolute" style="bottom:4px;left:4px">
          <div class="relative">
            <LocalVideo
              v-if="room.localStreams.video"
              style="width:213px;height:120px"
            />
            <LocalRoundWebcam
              v-if="room.localStreams.webcam && room.localStreams.video"
              class="absolute w-12 h-12"
              style="top:-2px;left:-2px"
            />
            <LocalWebcam
              v-if="room.localStreams.webcam && !room.localStreams.video"
              style="width:213px;height:120px"
            />
          </div>
        </div>
      </div>

      <!-- Hidden Audio Players (eg: Voice Chat) -->
      <div class="absolute visually-hidden">
        <VoiceChatter
          v-for="stream in enabledStreams.mic"
          :key="stream.producerId"
          :stream="stream"
        />
      </div>

      <Controls class="w-full" />
    </div>
    <ChatRoom v-if="$store.state.nav.chat" class="flex-shrink-0" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";

import VideoContainer from "@/components/VideoContainer";
import LocalVideo from "@/components/stream/LocalVideo";
import RemoteVideo from "@/components/stream/RemoteVideo";
import LocalWebcam from "@/components/stream/LocalWebcam";
import RemoteWebcam from "@/components/stream/RemoteWebcam";
import ExternalStream from "@/components/stream/ExternalStream";
import LocalRoundWebcam from "@/components/stream/LocalRoundWebcam";
import RemoteRoundWebcam from "@/components/stream/RemoteRoundWebcam";
import VoiceChatter from "@/components/stream/VoiceChatter";
import Controls from "@/components/stream/Controls";
import ChatRoom from "@/components/ChatRoom";

export default {
  components: {
    VideoContainer,
    LocalVideo,
    RemoteVideo,
    LocalWebcam,
    RemoteWebcam,
    ExternalStream,
    LocalRoundWebcam,
    RemoteRoundWebcam,
    VoiceChatter,
    Controls,
    ChatRoom
  },

  computed: {
    ...mapGetters("room", ["enabledStreams"]),

    room() {
      return this.$store.state.room;
    },

    largeStreams() {
      return (
        !!this.enabledStreams.video.length ||
        !!this.room.streams.external.length
      );
    },

    smallStreams() {
      return !!this.enabledStreams.webcam.length;
    },

    filteredWebcamStreams() {
      if (!this.$store.state.room.roomId) return [];
      return this.enabledStreams.webcam.filter(stream => {
        const { socketId } = stream;
        const { video } = this.$store.state.chat.users[socketId].producerIds;
        // If no video stream from user, or video stream is not being consumed, webcam is okay to show
        return !video || !this.room.consumers[video];
      });
    }
  },

  async mounted() {
    if (this.$store.state.room.roomId) return;
    this.$store.dispatch("nav/showModal", {
      id: "join-room",
      data: { noclose: true }
    });
  },

  beforeDestroy() {
    this.$store.dispatch("room/leave");
  }
};
</script>

<style></style>
