<template>
  <form class="form fixed-column wide-container" @submit.prevent="submit">
    <div class="field">
      <div class="label">Name*</div>
      <div class="control">
        <input
          v-model="form.name"
          type="text"
          class="input"
          placeholder="Name"
        />
      </div>
    </div>

    <div class="field">
      <div class="label">URL</div>
      <div class="control">
        <input v-model="form.url" type="text" class="input" placeholder="URL" />
      </div>
    </div>
    <url-metadata :url="form.url" />

    <div class="field">
      <div class="label">Notes</div>
      <div class="control">
        <quill-editor v-model="form.body" :options="quillOptions" />
      </div>
    </div>

    <div class="field">
      <div class="control has-text-centered">
        <button :disabled="!canSubmit" class="button is-success" type="submit">
          <template v-if="editId">Edit</template>
          <template v-else>Create</template>
        </button>
      </div>
    </div>
  </form>
</template>

<script lang="ts">
import { defineComponent, ref, watch, computed } from "@vue/composition-api";
import { quillEditor } from "vue-quill-editor";
import quillOptions from "@/config/quillOptions";
import { itemService } from "@/services/dataService";
import { ItemCreate, Workspace } from "@/types";
import UrlMetadata from "@/components/metadata/UrlMetadata.vue";
import { workspaceStore } from "@/store";
import pickBy from "lodash-es/pickBy";
import identity from "lodash-es/identity";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";

export default defineComponent({
  name: "ItemEditor",
  components: {
    quillEditor,
    UrlMetadata
  },
  props: {
    editId: {
      type: Number as () => number
    },
    redirect: {
      type: Boolean as () => boolean
    }
  },

  setup(props, { root, emit }) {
    const workspace = computed<Workspace>(workspaceStore.getters.workspace);
    const form = ref<ItemCreate>({
      name: "",
      url: "",
      body: ""
    });
    const submitting = ref<boolean>(false);
    const canSubmit = computed<boolean>(
      () => !!form.value.name && !submitting.value
    );

    const loadItem = async () => {
      if (props.editId) {
        const result = await itemService.getById(props.editId);

        // if item doesn't belong to workspace go back
        if ("success" in result) {
          if (result.data.workspaceId !== workspace.value.id) {
            root.$toasted.error("Item does not belong to workspace");
            root.$router.go(-1);
          } else {
            const { name, metadata: { url } = { url: "" }, body } = result.data;
            form.value = { name, url, body };
          }
        } else {
          root.$toasted.error("Error loading item: " + result.message);
        }
      }
    };
    watch(() => props.editId, loadItem);

    const submit = async () => {
      const data = {
        ...pickBy(form.value, identity),
        workspaceId: workspace.value.id
      } as ItemCreate;
      let result;

      submitting.value = true;

      if (props.editId) result = await itemService.update(props.editId, data);
      else result = await itemService.create(data);

      submitting.value = false;

      if ("success" in result) {
        // emit event
        if (props.editId) emit("item-updated", result.data);
        else emit("item-created", result.data);
        // redirect
        if (props.redirect) {
          root.$router.push({
            name: "Item",
            params: {
              itemId: result.data.id.toString()
            }
          });
        }
        // toast
        if (props.editId) root.$toasted.success("Item edited");
        else root.$toasted.success("Item created");
      } else {
        root.$toasted.error("Error submitting item: " + result.message);
      }
    };

    return {
      form,
      quillOptions,
      submit,
      canSubmit
    };
  }
});
</script>
