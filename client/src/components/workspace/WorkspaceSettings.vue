<template>
  <div class="form fixed-column wide-container vertical-pad">
    <workspace-editor :editMode="true" />
    <workspace-users />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import WorkspaceEditor from "@/components/workspace/WorkspaceEditor.vue";
import WorkspaceUsers from "@/components/workspace/WorkspaceUsers.vue";

export default defineComponent({
  name: "WorkspaceSettings",
  components: {
    WorkspaceEditor,
    WorkspaceUsers
  }
});
</script>
