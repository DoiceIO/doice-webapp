<template>
  <button
    v-bind="$attrs"
    v-on="$listeners"
    class="p-btn flex items-center inline-block font-bold"
    :class="`btn-${variant} ${computedSize} ${norounded ? '': 'rounded'}`"
  >
    <slot></slot>
  </button>
</template>

<script>
const variants = [
  "none",
  "primary",
  "primary-hover",
  "white",
  "white-outline",
  "dark",
  "primary-dashed"
];
const sizes = ["xs", "sm", "md", "lg"];

export default {
  props: {
    variant: {
      type: String,
      required: true,
      validator: function(value) {
        return variants.indexOf(value) > -1;
      }
    },

    size: {
      type: String,
      default: "md",
      validator: function(value) {
        return sizes.indexOf(value) > -1;
      }
    },

    norounded: Boolean
  },

  computed: {
    computedSize() {
      switch (this.size) {
        case "xs":
          return "px-1";
        case "sm":
          return "py-1 px-2";
        case "md":
          return "py-2 px-3";
        case "lg":
          return "py-3 px-4";
      }
    }
  }
};
</script>

<style lang="scss">
.p-link,
.p-btn {
  transition-duration: 100ms;
  color: #e2e8f0;

  &:hover {
    transform: translateY(-1px);
  }
}

.btn-primary {
  background: #009dee;
}

.btn-primary-outline {
  color: #009dee;
  background: #e2e8f0;

  &:hover {
    background: #009dee;
    color: #e2e8f0;
  }
}

.btn-white {
  background: #e2e8f0;
  color: #009dee;
}

.btn-white-outline {
  color: #e2e8f0;
  background: #009dee;

  &:hover {
    background: #e2e8f0;
    color: #009dee;
  }
}

.btn-primary-hover {
  color: #009dee;
  background: transparent;

  &:hover {
    background: #009dee;
    color: #e2e8f0;
  }
}

.btn-primary-dashed {
  @apply .border-dashed;
  @apply .border-primary;
  @apply .text-primary;
  @apply .py-2;
  @apply .px-4;
  @apply .font-bold;
  @apply .border-2;
  @apply .bg-dark-1;

  &:hover {
    color: #e2e8f0;
    background: #009dee;
  }
}
</style>