<template>
  <vue-simple-suggest
    mode="input"
    @select="itemSelect"
    display-attribute="name"
    :debounce="300"
    :list="searchItems"
  >
    <input class="input" placeholder="Search items" />
  </vue-simple-suggest>
</template>

<script lang="ts">
import { defineComponent, computed } from "@vue/composition-api";
import VueSimpleSuggest from "vue-simple-suggest";
import { Item, Workspace } from "@/types";
import { workspaceStore } from "@/store";
import { itemService } from "@/services/dataService";

export default defineComponent({
  name: "ItemPicker",
  components: {
    VueSimpleSuggest
  },
  props: {
    value: {
      type: Object as () => Item,
      required: true
    }
  },

  setup(props, { root, emit }) {
    const workspace = computed<Workspace>(workspaceStore.getters.workspace);

    const searchItems = async (search: string) => {
      const result = await itemService.getByWorkspace(workspace.value.id, {
        limit: 20,
        offset: 0,
        search
      });
      if ("success" in result) return result.data;
      else {
        root.$toasted.error("Error searching items: " + result.message);
        return [];
      }
    };

    const itemSelect = (suggest: Item) => {
      emit("input", suggest);
    };

    return {
      searchItems,
      itemSelect
    };
  }
});
</script>
