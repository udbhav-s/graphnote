<template>
  <div v-if="connection" class="connection-preview">
    <connection-header-box
      :connection="connection"
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
import { Connection } from "@/types";
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

  setup(props, { emit }) {
    const deleteConnection = async (id: number) => {
      emit("connection-deleted", id);
    };

    return {
      deleteConnection
    };
  }
});
</script>

<style lang="scss">
@import "@/assets/styles/style.scss";

.connection-preview {
  text-align: center;
  margin-bottom: 2rem;

  .items {
    display: flex;
    flex-direction: column;
    align-items: stretch;
  }

  .first {
    animation: leftSlide ease-out 0.3s;
  }

  .second {
    animation: rightSlide ease-out 0.3s;
  }

  .item-preview-container {
    margin-bottom: 0;
  }

  @include tablet {
    .items {
      flex-direction: row;
    }

    .item-preview-container {
      flex: 1;
    }
  }

  .box:not(:last-child) {
    margin-bottom: 0;
  }
}
</style>
