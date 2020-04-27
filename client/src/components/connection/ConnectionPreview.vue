<template>
  <div v-if="connection" class="connection-preview">
    <connection-header-box
      :connection="connection"
      :workspaceId="workspaceId"
      @deleteConnection="deleteConnection"
    />

    <div class="items">
      <item-preview :item="connection.item1" class="first" />
      <item-preview :item="connection.item2" class="second" />
    </div>

    <metadata-sub-box
      v-if="connection.metadata"
      :metadata="connection.metadata"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import { Connection } from "@/types/connection";
import MetadataSubBox from "@/components/metadata/MetadataSubBox.vue";
import ItemPreview from "@/components/item/ItemPreview.vue";
import ConnectionHeaderBox from "@/components/connection/ConnectionHeaderBox.vue";

export default defineComponent({
  name: "ConnectionPreview",
  props: {
    connection: {
      type: Object as () => Connection,
      required: true
    }
  },
  components: {
    MetadataSubBox,
    ItemPreview,
    ConnectionHeaderBox
  },

  setup(props, { root, emit }) {
    const deleteConnection = async (id: number) => {
      emit("connection-deleted", id);
    };

    return {
      deleteConnection,
      workspaceId: parseInt(root.$route.params.workspaceId)
    };
  }
});
</script>
