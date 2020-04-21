<template>
  <div>
    <h1 class="title">Workspaces</h1>
    <workspace-list />
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
