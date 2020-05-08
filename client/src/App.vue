<template>
  <div id="app">
    <app-header />
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import "@/assets/styles/style.scss";
import AppHeader from "@/components/AppHeader.vue";
import { userStore } from "@/store";
import { userService } from "@/services/dataService";

export default defineComponent({
  name: "App",
  components: {
    AppHeader
  },

  setup() {
    // load user on page load
    // since user might already be authenticated
    const loadUser = async () => {
      if (!userStore.getters.isAuthenticated()) {
        try {
          const result = await userService.getCurrent();
          if (!("error" in result)) {
            userStore.mutations.setUser(result.data);
          }
        } catch (err) {
          //
        }
      }
    };
    loadUser();
  }
});
</script>
