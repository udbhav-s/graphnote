<template>
  <div>
    <div class="field">
      <div class="label">
        Collaborators
      </div>
    </div>

    <div v-if="workspace.sharedUsers">
      <div
        v-for="user in workspace.sharedUsers"
        :key="user.id"
        class="shared-user level is-mobile"
      >
        <div class="level-left">
          <div class="level-item">{{ user.name }}</div>
        </div>

        <div class="level-right">
          <button
            @click="removeUser(user.name)"
            class="button is-small is-outlined is-danger"
            :disabled="disabled && currentUser.name !== user.name"
          >
            <template v-if="currentUser.name === user.name">
              Leave
            </template>
            <template v-else>
              Remove
            </template>
          </button>
        </div>
      </div>
    </div>

    <div class="field has-addons">
      <div class="control">
        <input
          v-model="username"
          type="text"
          class="input"
          placeholder="Username"
          :disabled="disabled"
        />
      </div>
      <div class="control">
        <button @click="addUser" class="button is-primary" :disabled="disabled">
          Add
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "@vue/composition-api";
import { Workspace, User } from "@/types";
import { workspaceStore, userStore } from "@/store";
import { workspaceService } from "@/services/dataService";

export default defineComponent({
  name: "WorkspaceUsers",

  setup(props, { root, emit }) {
    const username = ref<string>("");
    const workspace = computed<Workspace>(workspaceStore.getters.workspace);
    const user = computed<User>(userStore.getters.user);

    const addUser = async () => {
      const result = await workspaceService.addUser({
        workspaceId: workspace.value.id,
        username: username.value
      });
      if ("success" in result) {
        // reload workspace in store
        workspaceStore.mutations.reloadWorkspace();

        root.$toasted.success("User added");
        emit("workspace-user-added", result.data);
      } else {
        root.$toasted.error("Error adding user: " + result.message);
      }
    };

    const removeUser = async (username: string) => {
      const message =
        username === user.value.name
          ? "Are you sure you want to leave this workspace?"
          : "Are you sure you want to remove this user from the workspace";

      if (confirm(message)) {
        const result = await workspaceService.removeUser({
          workspaceId: workspace.value.id,
          username
        });
        if ("success" in result) {
          // reload workspace in store
          workspaceStore.mutations.reloadWorkspace();
          emit("workspace-user-removed", result.data);
          root.$toasted.success("User removed from workspace");
          // redirect if user removed themselves
          if (username === user.value.name) {
            root.$router.push("/");
          }
        } else {
          root.$toasted.error("Error removing user: " + result.message);
        }
      }
    };

    const disabled = computed<boolean>(() => {
      return workspace.value.userId !== user.value.id;
    });

    return {
      workspace,
      username,
      addUser,
      removeUser,
      disabled,
      currentUser: user
    };
  }
});
</script>

<style lang="scss">
.shared-user {
  margin-bottom: 1rem;
  padding: 0.5rem;
  border: thin solid rgba(0, 0, 0, 0);

  &:hover {
    border: thin solid rgba(0, 0, 0, 0.2);
  }
}
</style>
