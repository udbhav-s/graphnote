<template>
  <div>
    <h1 class="title">Connections</h1>

    <connection-preview
      v-for="connection in connections"
      :key="connection.id"
      :connection="connection"
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
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "@vue/composition-api";
import ConnectionPreview from "@/components/connection/ConnectionPreview.vue";
import { Connection } from "@/types/connection";
import { connectionService } from "@/services/dataService";
import { QueryOptions } from "@/types/queryOptions";

export default defineComponent({
  name: "ConnectionList",
  components: {
    ConnectionPreview
  },

  setup(props, { root }) {
    const workspaceId = parseInt(root.$route.params.workspaceId);
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
        workspaceId,
        options
      );
      if ("error" in result) {
        root.$toasted.error("Error loading connections");
        throw result.error;
      } else {
        // add items
        result.data.forEach(con => connections.value.push(con));
        // update pagination
        if (result.data.length < options.limit) hasMoreItems.value = false;
        options.offset += options.limit;
      }
    };

    loadConnections();

    return {
      connections,
      loadConnections,
      hasMoreItems
    };
  }
});
</script>
