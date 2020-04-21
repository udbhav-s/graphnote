<template>
  <div>
    <h1 class="title">Connections</h1>
    <connection-preview
      v-for="connection in connections"
      :key="connection.id"
      :connection="connection"
    />
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
    const connections = ref<Connection[]>(null);
    // pagination
    const options: QueryOptions = {
      limit: 20,
      offset: 0
    };

    // get connections
    const loadConnections = async () => {
      const result = await connectionService.getByWorkspace(
        workspaceId,
        options
      );
      if ("error" in result) {
        root.$toasted.error("Error loading connections");
        throw result.error;
      } else connections.value = result.data;
    };

    loadConnections();

    return {
      connections,
      loadConnections
    };
  }
});
</script>
