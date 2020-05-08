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
      <div class="label">URL</div>
      <div class="control">
        <input v-model="form.url" type="text" class="input" placeholder="URL" />
      </div>
    </div>
    <url-metadata :url="form.url" />

    <div class="field box">
      <div class="label">Item 1</div>

      <div class="tabs">
        <ul>
          <li :class="[item1Tab === 'existing' ? 'is-active' : '']">
            <a @click="item1Tab = 'existing'">Existing</a>
          </li>
          <li :class="[item1Tab === 'new' ? 'is-active' : '']">
            <a @click="item1Tab = 'new'">New</a>
          </li>
        </ul>
      </div>

      <div v-if="item1Tab === 'existing'">
        <div class="control">
          <item-picker v-model="item1" />
        </div>
        <item-preview v-if="item1.id" :item="item1" />
      </div>

      <div v-if="item1Tab === 'new'">
        <item-editor @item-created="item1Created" />
      </div>
    </div>

    <div class="field box">
      <div class="label">Item 2</div>

      <div class="tabs">
        <ul>
          <li :class="[item2Tab === 'existing' ? 'is-active' : '']">
            <a @click="item2Tab = 'existing'">Existing</a>
          </li>
          <li :class="[item2Tab === 'new' ? 'is-active' : '']">
            <a @click="item2Tab = 'new'">New</a>
          </li>
        </ul>
      </div>

      <div v-if="item2Tab === 'existing'">
        <div class="control">
          <item-picker v-model="item2" />
        </div>
        <item-preview v-if="item2.id" :item="item2" />
      </div>

      <div v-if="item2Tab === 'new'">
        <item-editor @item-created="item2Created" />
      </div>
    </div>

    <div class="field">
      <div class="label">Tags</div>
      <div class="control">
        <vue-tags-input
          v-model="tag"
          :tags="tags"
          :autocomplete-items="filteredTags"
          @tags-changed="newTags => (tags = newTags)"
        />
      </div>
    </div>

    <div class="field">
      <div class="control has-text-centered">
        <button :disabled="!canSubmit" class="button is-success" type="submit">
          Submit
        </button>
      </div>
    </div>
  </form>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  reactive,
  watch,
  computed
} from "@vue/composition-api";
import ItemEditor from "@/components/item/ItemEditor.vue";
import ItemPreview from "@/components/item/ItemPreview.vue";
import ItemPicker from "@/components/item/ItemPicker.vue";
import VueTagsInput from "@johmun/vue-tags-input";
import UrlMetadata from "@/components/metadata/UrlMetadata.vue";
import { Item, TagCreate, Workspace, ConnectionCreate } from "@/types";
import { connectionService, tagService } from "@/services/dataService";
import { workspaceStore } from "@/store";
import pickBy from "lodash-es/pickBy";
import identity from "lodash-es/identity";

export default defineComponent({
  name: "ConnectionEditor",
  components: {
    ItemEditor,
    ItemPreview,
    ItemPicker,
    VueTagsInput,
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
    const form = reactive<ConnectionCreate>({
      name: "",
      url: ""
    });
    const tags = ref<TagCreate[]>([]);
    const item1 = ref<Item>({});
    const item2 = ref<Item>({});
    const workspace = computed<Workspace>(workspaceStore.getters.workspace);
    const submitting = ref<boolean>(false);
    const canSubmit = computed<boolean>(() => {
      return !!item1.value.id && !!item2.value.id && !submitting.value;
    });

    const loadConnection = async () => {
      if (props.editId) {
        // fetch connection
        const result = await connectionService.getById(props.editId);
        if ("success" in result) {
          const con = result.data;
          // form data
          form.name = con.name;
          form.url = con.metadata?.url;
          tags.value = con.tags.map(tag => ({ text: tag.name }));
          // items
          item1.value = con.item1;
          item2.value = con.item2;
        } else {
          root.$toasted.error(result.message);
        }
      }
    };
    watch(() => props.editId, loadConnection);

    const submit = async () => {
      let result;
      const data = {
        ...pickBy(form, identity),
        tags: tags.value.map(t => t.text),
        item1Id: item1.value.id,
        item2Id: item2.value.id
      } as ConnectionCreate;

      submitting.value = true;

      if (props.editId)
        result = await connectionService.update(props.editId, data);
      else result = await connectionService.create(data);

      submitting.value = false;

      if ("success" in result) {
        // redirect
        if (props.redirect) {
          root.$router.push({
            name: "Connections",
            params: {
              workspaceId: workspace.value.id.toString()
            }
          });
        }
        // emit event
        emit("connection-created", result.data);
        // toast
        if (props.editId) root.$toasted.success("Connection edited");
        else root.$toasted.success("Connection created");
      } else {
        root.$toasted.error("Error submitting connection: " + result.message);
      }
    };

    const tag = ref<string>("");
    const workspaceTags = ref<TagCreate[]>([]);
    const loadWorkspaceTags = async () => {
      const result = await tagService.getByWorkspace(workspace.value.id);
      if ("success" in result) {
        workspaceTags.value = result.data.map(t => ({ text: t.name }));
      } else {
        root.$toasted.error("Error loading tags: " + result.message);
      }
    };
    watch(workspace, val => {
      if (val && val.id) loadWorkspaceTags();
    });

    const filteredTags = computed((): TagCreate[] => {
      return workspaceTags.value.filter(t => {
        return t.text.toLowerCase().indexOf(tag.value.toLowerCase()) !== -1;
      });
    });

    const item1Tab = ref<string>("existing");
    const item2Tab = ref<string>("existing");

    const item1Created = (item: Item) => {
      item1.value = item;
      item1Tab.value = "existing";
    };
    const item2Created = (item: Item) => {
      item2.value = item;
      item2Tab.value = "existing";
    };

    return {
      form,
      item1,
      item2,
      submit,
      canSubmit,
      tag,
      tags,
      filteredTags,
      item1Tab,
      item2Tab,
      item1Created,
      item2Created
    };
  }
});
</script>
