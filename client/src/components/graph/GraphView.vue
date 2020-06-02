<template>
  <div class="graph-page">
    <h1 class="title wide-container">Graph</h1>

    <div class="graph-input">
      <item-picker class="item-picker" :value="{}" @input="itemSearched" />
      <button
        @click="$router.push({ name: 'Graph', query: { all: 'true' } })"
        class="button is-primary"
      >
        Graph All
      </button>
    </div>
    <div class="graph-view">
      <div class="network-panel">
        <graph
          v-if="itemId || graphAll"
          :itemId="itemId"
          :graphAll="graphAll"
          @item-selected="itemSelected"
        />
      </div>
      <div class="item-panel">
        <item
          v-if="itemId || selectedItemId"
          :id="itemId || selectedItemId"
          :graph="false"
          @item-deleted="itemDeleted"
          @connection-deleted="connectionDeleted"
        />
        <div class="blank" v-else>
          <div>No item selected</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "@vue/composition-api";
import Graph from "@/components/graph/Graph.vue";
import ItemPage from "@/components/item/Item.vue";
import ItemPicker from "@/components/item/ItemPicker.vue";
import GraphEventBus from "@/components/graph/GraphEventBus";
import { Item } from "@/types";

export default defineComponent({
  name: "GraphView",
  props: {
    all: {
      type: Boolean as () => boolean
    },
    itemId: {
      type: Number as () => number
    }
  },
  components: {
    Graph,
    Item: ItemPage,
    ItemPicker
  },

  setup(props, { root }) {
    const graphAll = ref<boolean>(false);
    watch(
      () => props.all,
      val => {
        graphAll.value = !!val;
      }
    );

    const itemSearched = (item: Item) => {
      if (item && item.id) {
        root.$router.push({
          name: "Graph",
          query: {
            itemId: item.id.toString()
          }
        });
      }
    };

    const selectedItemId = ref<number>(null);
    const itemSelected = (item: Item) => {
      selectedItemId.value = item.id;
    };

    const itemDeleted = (id: number) => {
      // emit event on bus
      GraphEventBus.$emit("item-deleted", id);
      if (selectedItemId.value === id) selectedItemId.value = null;
    };

    const connectionDeleted = (item1Id: number, item2Id: number) => {
      GraphEventBus.$emit("connection-deleted", item1Id, item2Id);
    };

    return {
      selectedItemId,
      itemSearched,
      itemSelected,
      itemDeleted,
      connectionDeleted,
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

    .blank {
      background: $background;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
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
