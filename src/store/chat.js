import API from "@/api";

export default ({ socket }) => ({
  state: {
    messages: [],
    users: {}
  },

  getters: {},

  mutations: {
    ADD_MESSAGE(state, message) {
      state.messages.push(message);
    },

    SET_USERS(state, users) {
      state.users = users;
    }
  },

  actions: {
    join({ commit }, { room }) {
      commit("SET_USERS", room.users);

      socket.on("chat/message", message => {
        commit("ADD_MESSAGE", message);
      });

      socket.on("chat/users", users => {
        commit("SET_USERS", users);
      });
    },

    async sendMessage({ rootState }, text) {
      // If not in a room
      if (!rootState.room.roomId) return;

      const { ok, error } = await API.chat.message({
        text,
        roomId: rootState.room.roomId
      });

      if (!ok) {
        console.error(error);
      }

      return true;
    },

    leave() {
      socket.off("chat/message");
      socket.off("chat/users");
    }
  },

  namespaced: true
});
