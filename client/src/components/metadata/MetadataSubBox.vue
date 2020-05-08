<template>
  <a
    :href="metadata.url"
    v-if="metadata"
    class="box sub-box has-background-white-ter"
  >
    <div class="metadata">
      <div v-if="metadata.image" class="metadata-image">
        <img :src="metadata.image" />
      </div>
      <div v-if="metadata.title" class="metadata-title">
        {{ metadata.title }}
      </div>
    </div>
  </a>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import { Metadata } from "@/types";

export default defineComponent({
  name: "MetadataSubBox",
  props: {
    metadata: {
      type: Object as () => Metadata,
      required: true
    }
  }
});
</script>

<style lang="scss">
.metadata {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  .metadata-image {
    min-width: 50px;
    max-width: 8rem;
    margin-left: 1rem;
    margin-right: 1rem;
  }

  .metadata-title {
    text-align: left;
    margin-left: 1rem;
    margin-right: 1rem;
  }
}
</style>
