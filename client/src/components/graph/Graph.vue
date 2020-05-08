<template>
  <div class="network-container">
    <div id="mynetwork" class="network"></div>
    <div v-if="!stabilized" class="network network-loader">
      <div>
        <h1 v-if="!dataLoaded" class="title">Loading data...</h1>
        <div v-if="dataLoaded && !stabilized">
          <h1 class="title">
            Stabilizing layout {{ parseInt(stabilizedPercentage) }}%
          </h1>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  watch,
  onMounted,
  ref,
  computed
} from "@vue/composition-api";
import graphOptions from "@/config/graphOptions";
import * as vis from "vis-network/standalone";
import { connectionService } from "@/services/dataService";
import { Item, Connection, Workspace } from "@/types";
import { workspaceStore } from "@/store";

type Node = vis.Node & { item: Item };
type Edge = vis.Edge & { connection: Connection };

export default defineComponent({
  name: "Graph",
  props: {
    itemId: {
      type: Number as () => number
    },
    graphAll: {
      type: Boolean as () => boolean
    }
  },

  setup(props, { root, emit }) {
    let network: vis.Network;
    const nodes = new vis.DataSet([] as Node[]);
    const edges = new vis.DataSet([] as Edge[]);
    const data = {
      nodes: nodes,
      edges: edges
    };

    const workspace = computed<Workspace>(workspaceStore.getters.workspace);

    const dataLoaded = ref<boolean>(false);
    const stabilized = ref<boolean>(false);
    const stabilizedPercentage = ref<number>(0);

    const loadConnections = async (
      id?: number,
      initial?: boolean,
      graphAll?: boolean
    ) => {
      // clear if initial load
      if (initial) {
        data.nodes.clear();
        data.edges.clear();
      }

      // util
      const itemToNode = (item: Item) => {
        const node = {
          id: item.id,
          label: item.name
        } as Node;
        if (item.metadata?.image) {
          node.shape = "image";
          node.image = item.metadata.image;
        }
        // custom item property
        node.item = item;
        return node;
      };

      const connectionToEdge = (c: Connection) => {
        const edge = {
          id: c.id,
          from: c.item1Id,
          to: c.item2Id,
          label: c.name
        } as Edge;
        if (c.metadata?.url) {
          edge.width = 3;
          edge.color = "yellow";
        }
        // custom connection property
        edge.connection = c;
        return edge;
      };

      // load connections
      let result;
      if (initial) dataLoaded.value = false;

      if (graphAll)
        result = await connectionService.getByWorkspace(workspace.value.id);
      else if (id) result = await connectionService.getWithItem(id);
      else return;

      if (initial) dataLoaded.value = true;

      if ("success" in result) {
        const connections = result.data;
        // add items
        connections.forEach(c => {
          if (!data.nodes.getIds().some(id => c.item1Id == id)) {
            data.nodes.add(itemToNode(c.item1));
          }

          if (!data.nodes.getIds().some(id => c.item2Id == id)) {
            data.nodes.add(itemToNode(c.item2));
          }
        });
        // add connections
        data.edges.add(
          connections
            .filter(c => !data.edges.getIds().some(id => c.id === id))
            .map(connectionToEdge)
        );
      } else {
        root.$toasted.error(result.message);
      }
    };
    watch([() => props.itemId, () => props.graphAll], () => {
      loadConnections(props.itemId, true, props.graphAll);
    });

    const createNetwork = () => {
      const container = document.getElementById("mynetwork");
      if (container) network = new vis.Network(container, data, graphOptions);

      network.on("stabilizationProgress", function(params) {
        stabilized.value = false;
        stabilizedPercentage.value = (params.iterations / params.total) * 100;
        console.log((params.iterations / params.total) * 100);
      });

      network.once("stabilizationIterationsDone", function() {
        stabilized.value = true;
      });

      // click handler
      network.on("click", event => {
        if (event.nodes.length > 0) {
          const itemId = event.nodes[0] as number;
          loadConnections(itemId);

          const node = data.nodes.get(itemId) as Node;
          emit("item-selected", node.item);
        } else if (event.edges.length > 0) {
          const edgeId = event.edges[0] as number;

          const edge = data.edges.get(edgeId) as Edge;
          emit("connection-selected", edge.connection);
        }
      });
    };

    onMounted(() => {
      watch(dataLoaded, loaded => {
        if (loaded) createNetwork();
      });
    });

    return {
      dataLoaded,
      stabilized,
      stabilizedPercentage
    };
  }
});
</script>

<style lang="scss">
@import "@/assets/styles/style.scss";

.network-container {
  position: relative;
  border: solid 3px rgba(0, 0, 0, 0.1);
}

.network {
  width: 100%;
  height: 100%;
}

.network-loader {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  left: 0;
  background: $background;
}
</style>
