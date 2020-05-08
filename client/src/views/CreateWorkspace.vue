<template>
  <div>
    <div class="hero is-primary">
      <div class="hero-body">
        <h1 class="title">Create Workspace</h1>
      </div>
    </div>
    <div class="section fixed-column">
      <workspace-editor @workspace-created="workspaceCreated" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import WorkspaceEditor from "@/components/workspace/WorkspaceEditor.vue";
import { Workspace } from "@/types/workspace";

export default defineComponent({
  name: "CreateWorkspace",
  components: {
    WorkspaceEditor
  },

  setup(props, { root }) {
    const workspaceCreated = (workspace: Workspace) => {
      root.$router.push({
        name: "Connections",
        params: {
          workspaceId: workspace.id.toString()
        }
      });
    };

    return {
      workspaceCreated
    };
  }
});
</script>
