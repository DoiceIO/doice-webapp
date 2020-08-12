<template>
  <div id="app" class="w-screen h-screen bg-gray-900">
    <d-context-menu />
    <router-view></router-view>
    <DModal />
  </div>
</template>

<script>
import DModal from "@/components/DModal";

export default {
  components: {
    DModal
  }
};
</script>

<style lang="scss">
.tooltip {
  // ...

  &.popover {
    $color: #f9f9f9;

    .popover-inner {
      background: $color;
      color: black;
      padding: 24px;
      border-radius: 5px;
      box-shadow: 0 5px 30px rgba(black, 0.1);
    }

    .popover-arrow {
      border-color: $color;
    }
  }
}
</style>
