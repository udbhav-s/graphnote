<template>
  <div>{{ workspace.name }}</div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import { Workspace } from "@/types/workspace";

export default defineComponent({
  name: "WorkspacePreview",
  props: {
    workspace: {
      type: Object as () => Workspace,
      required: true
    }
  }
});
</script>
