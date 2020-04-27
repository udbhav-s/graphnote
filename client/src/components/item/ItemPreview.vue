<template>
  <div class="item-preview-container">
    <connection-header-box
      v-if="item.connection"
      :connection="item.connection"
      :workspaceId="item.workspaceId"
      @connection-deleted="$emit('item-deleted', item.id)"
    />

    <router-link
      :to="{ name: 'Item', params: { id: item.id } }"
      class="item-preview box"
    >
      <h2 class="title is-4 item-name">{{ item.name }}</h2>
      <template v-if="item.metadata">
        <div v-if="item.metadata.image" class="item-image">
          <img :src="item.metadata.image" />
        </div>
        <div class="item-meta">
          <h2 v-if="item.metadata.title" class="title is-6">
            {{ item.metadata.title }}
          </h2>
        </div>
      </template>
    </router-link>

    <metadata-sub-box
      v-if="item.connection && item.connection.metadata"
      :metadata="item.connection.metadata"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import { Item } from "@/types/item";
import MetadataSubBox from "@/components/metadata/MetadataSubBox.vue";
import ConnectionHeaderBox from "@/components/connection/ConnectionHeaderBox.vue";

export default defineComponent({
  name: "ItemPreview",
  props: {
    item: {
      type: Object as () => Item,
      required: true
    }
  },
  components: {
    MetadataSubBox,
    ConnectionHeaderBox
  }
});
</script>
