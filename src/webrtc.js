export default {
  async getUserMedia(constraints) {
    try {
      if (constraints.audio) {
        constraints.audio = {
          deviceId: "default",
          echoCancellation: false,
          googAutoGainControl: false
        };
      }
      let stream = await navigator.mediaDevices.getUserMedia(constraints);
      if (stream) {
        return { ok: true, stream };
      } else {
        alert("Could not get your requested media");
        return { ok: false };
      }
    } catch (err) {
      console.error(err); // TODO better error handeling
      return { ok: false, error: err.message };
    }
  },

  async getDisplayMedia(constraints) {
    try {
      if (constraints.audio) {
        constraints.audio = {
          autoGainControl: false,
          echoCancellation: false,
          googAutoGainControl: false,
          noiseSuppression: false
        };
      }
      let stream = await navigator.mediaDevices.getDisplayMedia(constraints);
      if (stream) {
        return { ok: true, stream };
      } else {
        alert("Could not get your requested media");
        return { ok: false };
      }
    } catch (err) {
      console.error(err); // TODO better error handeling
      return { ok: false, error: err.message };
    }
  }
};
