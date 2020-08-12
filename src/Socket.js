import io from "socket.io-client";

export default class Socket {
  constructor() {
    this.socket = io(process.env.VUE_APP_API_URL);
  }

  emit(event, data) {
    this.socket.emit(event, data);
  }

  on(event, callback) {
    this.socket.on(event, callback);
  }

  off(event, callback) {
    this.socket.off(event, callback);
  }
}
