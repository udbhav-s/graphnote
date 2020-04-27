<template>
  <div class="box connection-header has-background-white-ter">
    <div class="connection-name">
      <h1 class="title is-4">{{ connection.name }}</h1>
      <div class="options">
        <router-link
          :to="{
            name: 'EditConnection',
            params: { workspaceId, id: connection.id }
          }"
          class="button is-small"
        >
          Edit
        </router-link>
        <button
          @click="deleteConnection"
          class="options button is-small is-danger"
        >
          Delete
        </button>
      </div>
    </div>

    <div v-if="connection.tags && connection.tags.length > 0" class="tags">
      <div
        v-for="tag in connection.tags"
        :key="tag.id"
        class="tag is-primary is-small"
      >
        {{ tag.name }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import { Connection } from "@/types/connection";
import { connectionService } from "@/services/dataService";

export default defineComponent({
  name: "ConnectionHeaderBox",
  props: {
    connection: {
      type: Object as () => Connection,
      required: true
    },
    workspaceId: {
      type: Number as () => number,
      required: true
    }
  },

  setup(props, { root, emit }) {
    const deleteConnection = async () => {
      const result = await connectionService.del(props.connection.id);
      if ("error" in result) {
        root.$toasted.error("Error deleting connection");
      } else emit("connection-deleted", props.connection.id);
    };

    return {
      deleteConnection
    };
  }
});
</script>
