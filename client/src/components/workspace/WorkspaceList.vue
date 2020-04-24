<template>
  <div>
    <router-link
      v-for="workspace in workspaces"
      :key="workspace.id"
      :to="{ name: 'Connections', params: { workspaceId: workspace.id } }"
    >
      <workspace-preview :workspace="workspace" />
    </router-link>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "@vue/composition-api";
import { Workspace } from "@/types/workspace";
import { workspaceService } from "@/services/dataService";
import WorkspacePreview from "@/components/workspace/WorkspacePreview.vue";

export default defineComponent({
  name: "WorkspaceList",
  props: {
    sharedWith: {
      type: Boolean as () => boolean
    }
  },
  components: {
    WorkspacePreview
  },

  setup(props, { root }) {
    // load workspaces
    const workspaces = ref<Workspace[]>(null);

    const loadWorkspaces = async () => {
      console.log("load workspaces called");
      let result;
      // get workspaces shared with user
      if (props.sharedWith) result = await workspaceService.getSharedWith();
      // default - get user's workspaces
      else result = await workspaceService.getByUser();
      console.log("loaded");
      // set workspaces
      if ("error" in result) {
        root.$toasted.error("Error loading workspaces");
        throw result.message;
      } else workspaces.value = result.data;
    };

    loadWorkspaces();

    return {
      workspaces,
      loadWorkspaces
    };
  }
});
</script>
