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
          <item-picker v-model="item1" :workspaceId="workspaceId" />
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
          <item-picker v-model="item2" :workspaceId="workspaceId" />
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
        <button class="button is-success" type="submit">Submit</button>
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
import { ConnectionCreate } from "@/types/connection";
import { Item } from "@/types/item";
import { TagCreate } from "@/types/tag";
import { connectionService, tagService } from "@/services/dataService";
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

  setup(props, { root }) {
    const form = reactive<ConnectionCreate>({
      name: "",
      url: ""
    });
    const tags = ref<TagCreate[]>([]);
    const item1 = ref<Item>({});
    const item2 = ref<Item>({});

    const workspaceId = parseInt(root.$route.params.workspaceId);

    const loadConnection = async () => {
      if (props.editId) {
        // fetch connection
        const result = await connectionService.getById(props.editId);
        if ("error" in result) {
          root.$toasted.error("Error loading connection");
          console.log("error");
        } else {
          const con = result.data;
          // form data
          form.name = con.name;
          form.url = con.metadata?.url;
          tags.value = con.tags.map(tag => ({ text: tag.name }));
          // items
          item1.value = con.item1;
          item2.value = con.item2;
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

      if (props.editId)
        result = await connectionService.update(props.editId, data);
      else result = await connectionService.create(data);

      if ("error" in result) {
        root.$toasted.error("Error creating connection");
        console.log(result.error);
      } else {
        if (props.redirect) {
          root.$router.push({
            name: "Connections",
            params: {
              workspaceId: workspaceId.toString()
            }
          });
        }
      }
    };

    const tag = ref<string>("");
    const workspaceTags = ref<TagCreate[]>([]);
    const loadWorkspaceTags = async () => {
      const result = await tagService.getByWorkspace(workspaceId);
      if ("error" in result) {
        root.$toasted.error("Error loading tag list");
        console.log(result.error);
      } else {
        workspaceTags.value = result.data.map(t => ({ text: t.name }));
      }
    };
    loadWorkspaceTags().then(() => console.log(workspaceTags.value));

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
      workspaceId,
      submit,
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
