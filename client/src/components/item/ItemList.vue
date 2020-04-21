<template>
  <div>
    <h1 class="title">
      <template v-if="connectedWithItem">
        Connected Items
      </template>
      <template v-else>
        Items
      </template>
    </h1>

    <item-preview v-for="item in items" :key="item.id" :item="item" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "@vue/composition-api";
import ItemPreview from "@/components/item/ItemPreview.vue";
import { Item } from "@/types/item";
import { itemService } from "@/services/dataService";
import { QueryOptions } from "@/types/queryOptions";

export default defineComponent({
  name: "ItemList",
  props: {
    connectedWithItem: {
      type: Number as () => number
    }
  },
  components: {
    ItemPreview
  },

  setup(props, { root }) {
    const workspaceId = parseInt(root.$route.params.workspaceId);
    const items = ref<Item[]>(null);
    // pagination
    const options: QueryOptions = {
      limit: 20,
      offset: 0
    };

    const loadItems = async () => {
      // get connections
      let result;
      if (props.connectedWithItem) {
        result = await itemService.getConnectedWith(
          props.connectedWithItem,
          options
        );
      } else result = await itemService.getByWorkspace(workspaceId, options);

      if ("error" in result) {
        root.$toasted.error("Error loading items");
        console.log(result.error);
      } else items.value = result.data;
    };

    loadItems();

    // watch for change
    watch(
      () => props.connectedWithItem,
      () => {
        // reset pagination
        options.limit = 20;
        options.offset = 0;
        // reload items
        loadItems();
      }
    );

    return {
      items,
      loadItems
    };
  }
});
</script>
