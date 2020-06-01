<template>
  <div class="graph-page">
    <h1 class="title wide-container">Graph</h1>

    <div class="graph-input">
      <item-picker
        class="item-picker"
        v-model="item"
        @input="graphAll = false"
      />
      <button @click="graphAll = true" class="button is-primary">
        Graph All
      </button>
    </div>
    <div class="graph-view">
      <div class="network-panel">
        <graph
          v-if="(item && item.id) || graphAll"
          :itemId="item.id"
          :graphAll="graphAll"
          @item-selected="itemSelected"
        />
      </div>
      <div class="item-panel">
        <item
          v-if="selectedItemId || (item && item.id)"
          :id="selectedItemId || item.id"
          :graph="false"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "@vue/composition-api";
import Graph from "@/components/graph/Graph.vue";
import ItemPage from "@/components/item/Item.vue";
import ItemPicker from "@/components/item/ItemPicker.vue";
import { Item } from "@/types";

export default defineComponent({
  name: "GraphView",
  components: {
    Graph,
    Item: ItemPage,
    ItemPicker
  },

  setup() {
    const graphAll = ref<boolean>(false);
    const item = ref<Item>({});
    const selectedItemId = ref<number>(null);

    const itemSelected = (itm: Item) => {
      selectedItemId.value = itm.id;
    };

    return {
      selectedItemId,
      item,
      itemSelected,
      graphAll
    };
  }
});
</script>

<style lang="scss">
@import "@/assets/styles/style.scss";

.graph-page {
  padding-bottom: 0 !important;
}

.graph-input {
  display: flex;
  flex-direction: row;

  .item-picker {
    flex-grow: 1;
  }
}

.graph-view {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;

  & > div {
    flex: 1;
    height: 50vh;
    border: solid 3px rgba(0, 0, 0, 0.1);
  }

  .network-panel {
    .network-container {
      width: 100%;
      height: 100%;
    }
  }

  .item-panel {
    margin-top: 0;
    margin-bottom: 0;
    border-bottom: none;
  }

  @media only screen and (orientation: landscape) {
    flex-direction: row;

    & > div {
      height: 100%;
    }

    .network-panel {
      flex: 1.5;
    }

    .item-panel {
      overflow-y: scroll;
    }
  }
}
</style>
