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
import { Metadata } from "@/types/metadata";

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
