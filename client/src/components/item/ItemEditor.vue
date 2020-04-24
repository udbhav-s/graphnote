<template>
  <form class="form" @submit.prevent="submit">
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

    <div class="field">
      <div class="label">Body (optional)</div>
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
import { defineComponent, ref } from "@vue/composition-api";
import { quillEditor } from "vue-quill-editor";
import quillOptions from "@/config/quillOptions";
import { itemService } from "@/services/dataService";
import { Item } from "@/types/item";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";

export default defineComponent({
  name: "ItemEditor",
  components: {
    quillEditor
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
    // must only be opened under a workspace route
    const workspaceId = parseInt(root.$route.params.workspaceId);
    const form = ref<Partial<Item>>({
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
          const { name, url, body } = result.data;
          form.value = { name, url, body, workspaceId };
        }
      }
    };
    loadItem();

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
