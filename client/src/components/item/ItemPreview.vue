<template>
  <div class="item-preview-container">
    <connection-header-box
      v-if="item.connection"
      :connection="item.connection"
      :workspaceId="item.workspaceId"
      @connection-deleted="$emit('connection-deleted', item.id)"
    />

    <router-link
      :to="{ name: 'Item', params: { itemId: item.id } }"
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
import { Item } from "@/types";
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

<style lang="scss">
@import "@/assets/styles/style.scss";

.item-preview-container {
  margin-bottom: 2rem;
  display: flex;
  flex-direction: column;

  .item-preview {
    flex-grow: 1;
  }

  & > .box {
    margin-bottom: 0 !important;
  }
}

.item-preview.box {
  transition: 0.2s;
  // for spacing in connection view as item is stretched
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;

  &:hover {
    cursor: pointer;
    transform: scale(1.01);
    box-shadow: $hover-box-shadow;
    z-index: 2;
  }
}

.item-name.title {
  margin-bottom: 0.8rem !important;
}

.item-image {
  padding-bottom: 0.8rem;

  img {
    min-width: 80px;
    max-height: 200px;
  }
}
</style>
