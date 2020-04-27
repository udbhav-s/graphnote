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
import { defineComponent } from "@vue/composition-api";
import VueSimpleSuggest from "vue-simple-suggest";
import { Item } from "@/types/item";
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
    },
    workspaceId: {
      type: Number as () => number,
      required: true
    }
  },

  setup(props, { root, emit }) {
    const searchItems = async (search: string) => {
      const result = await itemService.getByWorkspace(props.workspaceId, {
        limit: 20,
        offset: 0,
        search
      });
      if ("error" in result) {
        root.$toasted.error("Error searching items");
        return [];
      } else return result.data;
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
