<template>
  <header class="navbar is-unselectable is-primary">
    <div class="navbar-brand">
      <template v-if="isAuthenticated">
        <router-link
          class="navbar-item"
          to="/"
          @click.native="isActive = false"
        >
          {{ user.name }}
        </router-link>
      </template>
      <template v-else>
        <router-link
          class="navbar-item"
          :to="{ name: 'Register' }"
          @click.native="isActive = false"
        >
          Sign up
        </router-link>
      </template>

      <span
        class="navbar-burger"
        @click="isActive = !isActive"
        :class="{ 'is-active': isActive }"
      >
        <span></span>
        <span></span>
        <span></span>
      </span>
    </div>
    <div
      class="navbar-menu"
      id="header-right"
      :class="{ 'is-active': isActive }"
    >
      <div class="navbar-end has-text-centered">
        <router-link
          class="navbar-item"
          to="/about"
          @click.native="isActive = false"
        >
          About
        </router-link>

        <a v-if="isAuthenticated" class="navbar-item" @click="logout">
          Log out
        </a>
      </div>
    </div>
  </header>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "@vue/composition-api";
import { userStore } from "@/store";
import { User } from "@/types";

export default defineComponent({
  name: "AppHeader",

  setup(props, { root }) {
    const isActive = ref<boolean>(false);
    const user = computed<User>(userStore.getters.user);
    const isAuthenticated = computed<boolean>(
      userStore.getters.isAuthenticated
    );

    const logout = async () => {
      isActive.value = false;
      await userStore.mutations.logout();
      root.$router.push({ name: "Login" });
    };

    return {
      isActive,
      user,
      isAuthenticated,
      logout
    };
  }
});
</script>

<style lang="scss">
#header-right.navbar-menu {
  box-shadow: 0px 73px 133px -40px rgba(0, 0, 0, 0.75);
}
</style>
