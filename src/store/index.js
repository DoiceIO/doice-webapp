import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

import Chat from "./chat.js";
import Nav from "./nav.js";
import Room from "./room.js";
import Tracks from "./tracks.js";

export default ({ socket }) => {
  return new Vuex.Store({
    modules: {
      chat: Chat({ socket }),
      room: Room({ socket }),
      nav: Nav(),
      tracks: Tracks({ socket })
    }
  });
};
