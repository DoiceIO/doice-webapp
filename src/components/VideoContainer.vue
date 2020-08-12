<template>
  <div
    ref="videos"
    class="videos relative flex flex-wrap items-center justify-center overflow-hidden"
  >
    <slot></slot>
  </div>
</template>

<script>
/* euclidean GCD (feel free to use any other) */
function gcd(a, b) {
  if (b > a) {
    let temp = a;
    a = b;
    b = temp;
  }
  while (b != 0) {
    let m = a % b;
    a = b;
    b = m;
  }
  return a;
}

/* ratio is to get the gcd and divide each component by the gcd, then return a string with the typical colon-separated value */
function ratio(x, y) {
  let c = gcd(x, y);
  return { w: x / c, h: y / c };
}

export default {
  mounted() {
    this.setProperSize();
    window.addEventListener("resize", this.setProperSize);

    this.unsubscribeFromActions = this.$store.subscribe(async () => {
      await this.$nextTick();
      this.setProperSize();
    });
  },

  beforeDestroy() {
    window.removeEventListener("resize", this.setProperSize);
    this.unsubscribeFromActions();
  },

  methods: {
    async setProperSize() {
      if (!this.$refs.videos) return;

      this.$refs.videos.style.height = "100%";
      const height = this.$refs.videos.offsetHeight;
      const width = this.$refs.videos.offsetWidth;

      const videos = this.$refs.videos.querySelectorAll(".video");
      const n = videos.length;

      let bestHeight = 0;
      let bestWidth = 0;
      let rowsCount = 0;

      for (let perRow = 1; perRow <= n; perRow++) {
        let numRows = Math.ceil(n / perRow);
        let maxWidth = Math.floor(width / perRow);
        let maxHeight = Math.floor(height / numRows);

        const video = videos[perRow - 1];
        video.style.position = "absolute";
        video.style.height = "auto";
        video.style.width = "auto";
        const r = ratio(video.offsetWidth, video.offsetHeight);
        video.style.position = "";

        if ((maxWidth * 9) / 16 < maxHeight) {
          maxHeight = (maxWidth * 9) / 16;
        } else {
          maxWidth = (maxHeight * 16) / 9;
        }

        if (maxWidth > bestWidth) {
          bestWidth = maxWidth;
          bestHeight = maxHeight;
          rowsCount = numRows;
        }
      }

      this.$refs.videos.style.height = `${Math.floor(
        rowsCount * bestHeight
      )}px`;

      videos.forEach(video => {
        video.style.height = `${Math.floor(bestHeight)}px`;
        video.style.width = `${Math.floor(bestWidth)}px`;
      });
    }
  }
};
</script>

<style lang="scss">
.videos > .video {
  padding: 0.25rem;
}
</style>