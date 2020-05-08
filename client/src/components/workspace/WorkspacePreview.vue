<template>
  <router-link
    :to="{ name: 'Items', params: { workspaceId: workspace.id } }"
    class="box"
  >
    <h1 class="title is-5">{{ workspace.name }}</h1>
    <div class="workspace-meta">
      <span v-if="shared">
        <strong>Shared by {{ workspace.user.name }}</strong>
      </span>
      <span>{{ createdAt }}</span>
      <span>
        {{ workspace.sharedUsers.length }}
        {{
          workspace.sharedUsers.length == 1 ? "collaborator" : "collaborators"
        }}
      </span>
      <span>
        <template v-if="workspace.public">Public</template>
        <template v-else>Private</template>
      </span>
    </div>
  </router-link>
</template>

<script lang="ts">
import { defineComponent, computed } from "@vue/composition-api";
import { Workspace, User } from "@/types";
import { userStore } from "@/store";

export default defineComponent({
  name: "WorkspacePreview",
  props: {
    workspace: {
      type: Object as () => Workspace,
      required: true
    }
  },

  setup(props) {
    const createdAt = computed<string>(() =>
      new Date(props.workspace.createdAt).toDateString()
    );
    const user = computed<User>(userStore.getters.user);
    const shared = computed<boolean>(() => {
      return (
        props.workspace.sharedUsers?.some(u => u.id === user.value.id) || false
      );
    });

    return {
      createdAt,
      shared
    };
  }
});
</script>

<style lang="scss">
.workspace-meta {
  & > span:not(:last-child) {
    padding-right: 1rem;
  }
}
</style>
