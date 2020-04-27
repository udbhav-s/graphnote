<template>
  <form class="form fixed-column wide-container" @submit.prevent="submit">
    <div class="field">
      <div class="label">Name</div>
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
      <div class="label">URL (optional)</div>
      <div class="control">
        <input v-model="form.url" type="text" class="input" placeholder="URL" />
      </div>
    </div>
    <url-metadata :url="form.url" />

    <div class="field">
      <div class="label">Notes (optional)</div>
      <div class="control">
        <quill-editor v-model="form.body" :options="quillOptions" />
      </div>
    </div>

    <div class="field">
      <div class="control has-text-centered">
        <button class="button is-success" type="submit">Submit</button>
      </div>
    </div>
  </form>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "@vue/composition-api";
import { quillEditor } from "vue-quill-editor";
import quillOptions from "@/config/quillOptions";
import { itemService } from "@/services/dataService";
import { ItemCreate } from "@/types/item";
import UrlMetadata from "@/components/metadata/UrlMetadata.vue";
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
    // must be opened under a workspace route
    const workspaceId = parseInt(root.$route.params.workspaceId);
    const form = ref<ItemCreate>({
      name: "",
      url: "",
      body: "",
      workspaceId
    });

    const loadItem = async () => {
      if (props.editId) {
        const result = await itemService.getById(props.editId);
        if ("error" in result) {
          root.$toasted.error("Error loading item");
          console.log(result.error);
        } else if (result.data.workspaceId !== workspaceId) {
          // if item doesn't belong to workspace go back
          root.$toasted.error("Item does not belong to workspace");
          root.$router.go(-1);
        } else {
          const { name, metadata: { url } = { url: "" }, body } = result.data;
          form.value = { name, url, body, workspaceId };
        }
      }
    };
    watch(() => props.editId, loadItem);

    const submit = async () => {
      let result;
      if (props.editId)
        result = await itemService.update(props.editId, form.value);
      else result = await itemService.create(form.value);

      if ("error" in result) {
        root.$toasted.error("Error creating item");
        console.log(result.error);
      } else {
        // emit event
        if (props.editId) emit("item-updated", result.data);
        else emit("item-created", result.data);
        // redirect
        if (props.redirect) {
          root.$router.push({
            name: "Item",
            params: {
              id: result.data.id.toString()
            }
          });
        }
      }
    };

    return {
      form,
      quillOptions,
      submit
    };
  }
});
</script>
