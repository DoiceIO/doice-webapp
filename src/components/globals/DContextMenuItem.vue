<template>
  <li
    @click="onClick"
    class="context-menu-item relative block p-2 text-sm rounded-md cursor-pointer font-bold"
  >
    <slot />
  </li>
</template>

<script>
export default {
  methods: {
    onClick(event) {
      this.$emit("click", event);
      this.$store.commit("nav/SET_CONTEXT_MENU", { id: "", data: {} });
    }
  }
};
</script>

<style lang="scss" scoped>
.context-menu-item {
  &:hover,
  &:focus {
    background: #fff;
    color: #000;
    outline: none;
  }
}
</style>
