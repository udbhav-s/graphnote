<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import "@/assets/styles/style.scss";

export default defineComponent({
  name: "App",
  components: {}
});
</script>
