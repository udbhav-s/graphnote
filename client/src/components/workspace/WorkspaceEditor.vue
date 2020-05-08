<template>
  <form @submit.prevent="submit">
    <div class="field">
      <div class="label">
        Name
      </div>
      <div class="control">
        <input
          v-model="form.name"
          type="text"
          class="input"
          placeholder="Workspace Name"
          :disabled="disabled"
        />
      </div>
    </div>

    <div class="field">
      <div class="control">
        <div class="select">
          <select v-model="form.public" :disabled="disabled">
            <option :value="false">Private</option>
            <option :value="true">Public</option>
          </select>
        </div>
      </div>
    </div>

    <div class="level vertical-pad-m has-text-centered">
      <div class="level-left">
        <button
          class="button is-primary"
          type="submit"
          :disabled="disabled || !canSubmit"
        >
          Save
        </button>
      </div>

      <div class="level-right">
        <button
          @click="deleteWorkspace"
          v-if="editMode"
          :disabled="disabled"
          class="button is-danger"
          type="button"
        >
          Delete Workspace
        </button>
      </div>
    </div>
  </form>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  computed,
  watch
} from "@vue/composition-api";
import { workspaceService } from "@/services/dataService";
import { workspaceStore, userStore } from "@/store";
import { Workspace, User } from "@/types";

export default defineComponent({
  name: "WorkspaceEditor",
  props: {
    editMode: {
      type: Boolean as () => boolean
    }
  },

  setup(props, { root, emit }) {
    const workspace = computed<Workspace>(workspaceStore.getters.workspace);
    const form = reactive({
      name: "",
      public: false
    });
    const canSubmit = computed<boolean>(() => {
      return !!form.name && typeof form.public === "boolean";
    });
    // watch since component loads before store can load the workspace
    if (props.editMode) {
      watch(
        workspaceStore.getters.workspace,
        val => {
          form.name = val.name;
          form.public = val.public;
        },
        {
          deep: true
        }
      );
    }

    const user = computed<User>(userStore.getters.user);
    const disabled = computed<boolean | undefined>(() => {
      return props.editMode && workspace.value.userId !== user.value.id;
    });

    const submit = async () => {
      let result;
      if (props.editMode)
        result = await workspaceService.update(workspace.value.id, form);
      else result = await workspaceService.create(form);

      if ("success" in result) {
        if (props.editMode) {
          // reload workspace in store
          workspaceStore.mutations.setWorkspace(result.data);
          root.$toasted.success("Saved!");
        } else emit("workspace-created", result.data);
      } else {
        root.$toasted.error("Error saving workspace: " + result.message);
      }
    };

    const deleteWorkspace = async () => {
      if (confirm("Are you sure you want to delete this workspace?")) {
        const result = await workspaceService.del(workspace.value.id);
        if ("success" in result) {
          root.$toasted.success("Workspace deleted");
          root.$router.push("/");
        } else {
          root.$toasted.error("Error deleting workspace: " + result.message);
        }
      }
    };

    return {
      form,
      submit,
      canSubmit,
      disabled,
      deleteWorkspace
    };
  }
});
</script>
