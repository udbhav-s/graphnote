<template>
  <div class="wide-container">
    <h1 class="title">
      <template v-if="connectedWithItem">
        Connected Items
      </template>
      <template v-else>Items</template>
    </h1>

    <div class="item-list">
      <item-preview
        v-for="item in items"
        :key="item.id"
        :item="item"
        @item-deleted="deleteItem"
      />
    </div>

    <div class="field has-text-centered">
      <button v-if="hasMoreItems" @click="loadItems" class="button is-primary">
        Load More
      </button>
    </div>

    <div
      v-if="items.length === 0"
      class="container vertical-pad-m has-text-centered"
    >
      <router-link :to="{ name: 'CreateItem' }">
        Create Item
      </router-link>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, computed } from "@vue/composition-api";
import ItemPreview from "@/components/item/ItemPreview.vue";
import { Item, QueryOptions, Workspace } from "@/types";
import { itemService } from "@/services/dataService";
import { workspaceStore } from "@/store";

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
    const workspace = computed<Workspace>(workspaceStore.getters.workspace);
    const items = ref<Item[]>([]);
    // pagination
    const options: QueryOptions = {
      limit: 20,
      offset: 0
    };
    const hasMoreItems = ref<boolean>(true);

    const loadItems = async (reset?: boolean) => {
      // get connections
      let result;
      if (props.connectedWithItem) {
        result = await itemService.getConnectedWith(
          props.connectedWithItem,
          options
        );
      } else {
        result = await itemService.getByWorkspace(workspace.value.id, options);
      }

      if ("success" in result) {
        // reset pagination and items
        if (reset) {
          options.limit = 20;
          options.offset = 0;
          items.value = [];
        }

        // add items
        result.data.forEach(item => items.value.push(item));

        // update pagination
        if (result.data.length < options.limit) hasMoreItems.value = false;
        options.offset += options.limit;
      } else {
        root.$toasted.error("Error loading items: " + result.message);
      }
    };

    // watch for change
    watch([() => props.connectedWithItem, workspace], () => {
      if (workspace.value.id) {
        loadItems(true);
      }
    });

    const deleteItem = (id: number) => {
      items.value = items.value.filter(i => i.id !== id);
    };

    return {
      items,
      loadItems,
      hasMoreItems,
      deleteItem
    };
  }
});
</script>

<style lang="scss">
@import "@/assets/styles/style.scss";

.item-list {
  @include tablet {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: stretch;
    justify-content: space-evenly;

    .item-preview-container {
      width: 20rem;
    }
  }
}
</style>
