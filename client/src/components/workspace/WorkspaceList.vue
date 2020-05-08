<template>
  <div>
    <workspace-preview
      v-for="workspace in workspaces"
      :key="workspace.id"
      :workspace="workspace"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "@vue/composition-api";
import { Workspace } from "@/types";
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
      let result;
      // get workspaces shared with user
      if (props.sharedWith) result = await workspaceService.getSharedWith();
      // default - get user's workspaces
      else result = await workspaceService.getByUser();
      // set workspaces
      if ("success" in result) workspaces.value = result.data;
      else root.$toasted.error("Error loading workspaces: " + result.message);
    };

    loadWorkspaces();

    return {
      workspaces,
      loadWorkspaces
    };
  }
});
</script>
