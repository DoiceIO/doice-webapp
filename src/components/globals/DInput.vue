<template>
  <label class="block text-lg">
    <div class="flex" :class="{ 'flex-wrap items-center': type !== 'checkbox' }">
      <input
        v-if="type === 'checkbox'"
        type="checkbox"
        v-bind="$attrs"
        @input="$emit('input', !value)"
        class="w-6 h-6 mr-2 flex-shrink-0 bg-gray-200 text-gray-800 rounded border"
      />
      <span v-if="label" :class="{ 'visually-hidden': screenReaderOnly }">
        {{ label }}
        <span
          v-if="$attrs.required !== undefined"
          title="Required"
          aria-hidden
          class="text-red-500"
        >*</span>
      </span>
      <input
        v-if="['text', 'email', 'password'].indexOf(type) > -1"
        :type="type"
        v-bind="$attrs"
        :value="value"
        @input="$emit('input', $event.target.value)"
        @blur="$emit('blur')"
        class="rounded text-xl border text-gray-800 h-10 py-2 px-3 w-full"
        :class="invalid ? 'border-red-500' : ''"
      />
    </div>
  </label>
</template>

<script>
const types = ["text", "email", "password", "checkbox"];

export default {
  props: {
    value: {
      type: [String, Number, Boolean],
      required: true
    },
    type: {
      type: String,
      default: "text",
      validator: function(value) {
        return types.indexOf(value) > -1;
      }
    },
    label: String,
    screenReaderOnly: {
      type: Boolean,
      default: false
    },
    invalid: Boolean
  }
};
</script>

<style lang="scss">
input:disabled {
  @apply text-gray-600;
}
</style>
