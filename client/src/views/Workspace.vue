<template>
  <section v-if="workspace">
    <div>
      <div class="hero is-primary">
        <div class="hero-body">
          <router-link :to="{ name: 'Items' }" class="title">
            {{ workspace.name }}
          </router-link>
        </div>

        <div class="hero-foot">
          <nav class="tabs is-boxed">
            <div class="container">
              <ul>
                <li :class="[$route.name == 'Items' ? 'is-active' : null]">
                  <router-link :to="{ name: 'Items' }">
                    Items
                  </router-link>
                </li>
                <li
                  :class="[$route.name == 'Connections' ? 'is-active' : null]"
                >
                  <router-link :to="{ name: 'Connections' }">
                    Connections
                  </router-link>
                </li>
                <li :class="[$route.name == 'Graph' ? 'is-active' : null]">
                  <router-link :to="{ name: 'Graph' }">
                    Graph
                  </router-link>
                </li>
                <li
                  v-if="isAuthenticated"
                  :class="[$route.name == 'CreateItem' ? 'is-active' : null]"
                >
                  <router-link :to="{ name: 'CreateItem' }">
                    New Item
                  </router-link>
                </li>
                <li
                  v-if="isAuthenticated"
                  :class="[
                    $route.name == 'CreateConnection' ? 'is-active' : null
                  ]"
                >
                  <router-link :to="{ name: 'CreateConnection' }">
                    Connect
                  </router-link>
                </li>
                <li
                  v-if="isAuthenticated"
                  :class="[
                    $route.name == 'WorkspaceSettings' ? 'is-active' : null
                  ]"
                >
                  <router-link :to="{ name: 'WorkspaceSettings' }">
                    Settings
                  </router-link>
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </div>

      <div>
        <transition name="fade" mode="out-in">
          <router-view class="vertical-pad" />
        </transition>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, computed } from "@vue/composition-api";
import { Workspace } from "@/types/workspace";
import { workspaceStore, userStore } from "@/store";

export default defineComponent({
  name: "Workspace",
  props: {
    id: {
      type: Number as () => number,
      required: true
    }
  },

  setup() {
    const workspace = computed<Workspace>(workspaceStore.getters.workspace);
    const isAuthenticated = computed<boolean>(
      userStore.getters.isAuthenticated
    );

    return {
      workspace,
      isAuthenticated
    };
  },

  beforeRouteEnter(to, from, next) {
    if (to.params.workspaceId != from.params.workspaceId) {
      workspaceStore.mutations
        .loadWorkspace(parseInt(to.params.workspaceId))
        .catch(err => {
          if (err.statusCode === 403) next({ name: "Forbidden" });
        });
    }
    return next();
  },

  beforeRouteUpdate(to, from, next) {
    if (to.meta.workspaceId != from.meta.workspaceId) {
      workspaceStore.mutations
        .loadWorkspace(parseInt(to.meta.workspaceId))
        .catch(err => {
          if (err.statusCode === 403) next({ name: "Forbidden" });
        });
    }
    return next();
  },

  beforeRouteLeave(to, from, next) {
    workspaceStore.mutations.setWorkspace({} as Workspace);
    next();
  }
});
</script>
