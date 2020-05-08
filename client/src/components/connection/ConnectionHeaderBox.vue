<template>
  <div class="box connection-header has-background-white-ter">
    <div class="connection-name">
      <h1 class="title is-4">{{ connection.name }}</h1>
      <div v-if="isAuthenticated" class="options">
        <router-link
          :to="{
            name: 'EditConnection',
            params: { id: connection.id }
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
import { defineComponent, computed } from "@vue/composition-api";
import { Connection } from "@/types";
import { connectionService } from "@/services/dataService";
import { userStore } from "@/store";

export default defineComponent({
  name: "ConnectionHeaderBox",
  props: {
    connection: {
      type: Object as () => Connection,
      required: true
    }
  },

  setup(props, { root, emit }) {
    const isAuthenticated = computed<boolean>(
      userStore.getters.isAuthenticated
    );

    const deleteConnection = async () => {
      if (confirm("Are you sure you want to delete this connection?")) {
        const result = await connectionService.del(props.connection.id);

        if ("success" in result) {
          emit("connection-deleted", props.connection.id);
          root.$toasted.success("Connection deleted");
        } else
          root.$toasted.error("Error deleting connection: " + result.message);
      }
    };

    return {
      isAuthenticated,
      deleteConnection
    };
  }
});
</script>

<style lang="scss">
.box.connection-header {
  padding: 0.8rem;

  .connection-name {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    .title {
      margin-bottom: 0;
    }

    .options {
      display: flex;
      flex-direction: row;
    }
  }

  .tags {
    margin-top: 0.5rem;
  }
}
</style>
