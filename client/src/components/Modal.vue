<template>
  <div class="modal is-active">
    <div class="modal-background"></div>
    <div class="modal-content">
      <slot></slot>
    </div>
    <button
      @click="$emit('modal-close')"
      class="modal-close is-large"
      aria-label="close"
    ></button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";

export default defineComponent({
  name: "Modal"
});
</script>
