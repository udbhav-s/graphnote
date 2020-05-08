<template>
  <div class="field">
    <metadata-sub-box v-if="urlMetadata" :metadata="urlMetadata" />
    <div v-if="urlLoading" class="loading" style="height: 5rem"></div>
    <div v-if="invalidUrl" class="label has-text-danger">Invalid url</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "@vue/composition-api";
import { Metadata } from "@/types";
import { metadataService } from "@/services/dataService";
import MetadataSubBox from "@/components/metadata/MetadataSubBox.vue";
import debounce from "lodash-es/debounce";

export default defineComponent({
  name: "UrlMetadata",
  props: {
    url: String as () => string
  },
  components: {
    MetadataSubBox
  },

  setup(props) {
    const urlMetadata = ref<Partial<Metadata>>(null);
    const invalidUrl = ref<boolean>(false);
    const urlLoading = ref<boolean>(false);
    const loadMetadata = debounce(async () => {
      if (props.url) {
        urlMetadata.value = null;
        urlLoading.value = true;
        const result = await metadataService.scrape(props.url);
        urlLoading.value = false;

        if ("error" in result) {
          invalidUrl.value = true;
        } else urlMetadata.value = result.data;
      } else urlMetadata.value = null;
    }, 300);
    watch(() => props.url, loadMetadata);

    return {
      urlMetadata,
      invalidUrl,
      urlLoading
    };
  }
});
</script>
