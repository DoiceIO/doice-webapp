const API_URL = process.env.VUE_APP_API_URL || window.location.origin;

const http = {
  get(path, options = {}) {
    return fetch(`${API_URL}/api${path}`, {
      ...options,
      body: JSON.stringify(options.body),
      headers: {
        "Content-type": "application/json",
        "socket-id": window.socket.id,
        "user-key": window.userKey,
        ...(options.headers || {})
      }
    })
      .then(async res => {
        const { data, error } = await res.json();

        return {
          ok: res.ok,
          data,
          error
        };
      })
      .catch(console.error);
  },

  post(path, options = {}) {
    return http.get(path, {
      method: "POST",
      ...options
    });
  },

  put(path, options = {}) {
    return http.get(path, {
      method: "PUT",
      ...options
    });
  },

  delete(path, options = {}) {
    return http.get(path, {
      method: "DELETE",
      ...options
    });
  }
};

export default {
  room: {
    join(body) {
      return http.post("/room/join", { body });
    }
  },

  transport: {
    create(body) {
      return http.post("/transport/create", { body });
    },

    connect(body) {
      return http.post("/transport/connect", { body });
    },

    consume(body) {
      return http.post("/transport/consume", { body });
    },

    produce(body) {
      return http.post("/transport/produce", { body });
    },

    produced(body) {
      return http.post("/transport/produced", { body });
    }
  },

  consumer: {
    pause(body) {
      return http.post("/consumer/pause", { body });
    },

    close(body) {
      return http.post("/consumer/close", { body });
    }
  },

  producer: {
    pause(body) {
      return http.post("/producer/pause", { body });
    },

    close(body) {
      return http.post("/producer/close", { body });
    }
  },

  stream: {
    video(body) {
      return http.post("/stream/video", { body });
    },

    webcam(body) {
      return http.post("/stream/webcam", { body });
    },

    mic(body) {
      return http.post("/stream/mic", { body });
    }
  },

  mic: {
    mute(body) {
      return http.post("/mic/mute", { body });
    }
  },

  external: {
    create(body) {
      return http.post("/external/create", { body });
    },

    close(body) {
      return http.post("/external/close", { body });
    }
  },

  video: {
    time(body) {
      return http.post("/video/time", { body });
    },

    play(body) {
      return http.post("/video/play", { body });
    },

    pause(body) {
      return http.post("/video/pause", { body });
    },

    add(body) {
      return http.post("/video/add", { body });
    },

    skip(body) {
      return http.post("/video/skip", { body });
    },

    buffer(body) {
      return http.post("/video/buffer", { body });
    }
  },

  chat: {
    message(body) {
      return http.post("/chat/message", { body });
    },

    username(body) {
      return http.post("/chat/username", { body });
    }
  }
};
