import API from "@/api";

export default ({ socket }) => {
  const state = {
    local: {
      mic: {
        isPaused: false
      }
    },
    remote: {}
  };

  const getters = {};

  const mutations = {
    PAUSE_LOCAL_TRACK(state, { type, value }) {
      state.local[type].isPaused = value;
    },

    PAUSE_REMOTE_TRACK(state, { socketId, value }) {
      state.remtote[producerId].isPaused = value;
    }
  };

  const actions = {
    async pauseProducer({ commit, rootState }, { type, value }) {
      commit("PAUSE_LOCAL_TRACK", { type, value });

      const { ok, error } = await API.mic.mute({
        producerId: rootState.room.producers[type].id,
        mute: value,
        roomId: rootState.room.roomId
      });

      if (!ok) {
        console.error(error);
        return;
      }
    }
  };

  return {
    state,
    getters,
    mutations,
    actions,
    namespaced: true
  };
};
