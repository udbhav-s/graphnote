<template>
  <div class="section fixed-column">
    <h1 class="title">Connections</h1>

    <connection-preview
      v-for="connection in connections"
      :key="connection.id"
      :connection="connection"
      @connection-deleted="deleteConnection"
    />

    <div class="field has-text-centered">
      <button
        v-if="hasMoreItems"
        @click="loadConnections"
        class="button is-primary"
      >
        Load More
      </button>
    </div>

    <div
      v-if="connections.length === 0"
      class="container vertical-pad-m has-text-centered"
    >
      <router-link :to="{ name: 'CreateConnection' }">
        Create Connection
      </router-link>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch } from "@vue/composition-api";
import ConnectionPreview from "@/components/connection/ConnectionPreview.vue";
import { Connection, QueryOptions, Workspace } from "@/types";
import { connectionService } from "@/services/dataService";
import { workspaceStore } from "@/store";

export default defineComponent({
  name: "ConnectionList",
  components: {
    ConnectionPreview
  },

  setup(props, { root }) {
    const workspace = computed<Workspace>(workspaceStore.getters.workspace);
    const connections = ref<Connection[]>([]);
    // pagination
    const options: QueryOptions = {
      limit: 20,
      offset: 0
    };
    const hasMoreItems = ref<boolean>(true);

    // get connections
    const loadConnections = async () => {
      const result = await connectionService.getByWorkspace(
        workspace.value.id,
        options
      );
      if ("success" in result) {
        // add items
        result.data.forEach(con => connections.value.push(con));
        // update pagination
        if (result.data.length < options.limit) hasMoreItems.value = false;
        options.offset += options.limit;
      } else {
        root.$toasted.error("Error loading connections: " + result.message);
      }
    };
    watch(workspace, () => {
      if (workspace.value.id) loadConnections();
    });

    const deleteConnection = (id: number) => {
      connections.value = connections.value.filter(c => c.id !== id);
    };

    return {
      connections,
      loadConnections,
      hasMoreItems,
      deleteConnection
    };
  }
});
</script>
