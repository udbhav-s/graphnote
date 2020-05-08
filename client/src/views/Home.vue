<template>
  <div>
    <div class="hero is-primary">
      <div class="hero-body">
        <h1 class="title">Workspaces</h1>
      </div>
    </div>
    <div>
      <workspace-list />
      <workspace-list sharedWith />
    </div>
    <div class="container vertical-pad-m has-text-centered">
      <router-link :to="{ name: 'WorkspaceCreate' }">
        Create new workspace
      </router-link>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import WorkspaceList from "@/components/workspace/WorkspaceList.vue";

export default defineComponent({
  name: "Home",
  components: {
    WorkspaceList
  }
});
</script>
