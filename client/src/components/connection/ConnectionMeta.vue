<template>
  <a
    :href="connection.url"
    v-if="connection.url"
    class="box connection-meta-container has-background-white-ter"
  >
    <div v-if="connectionMeta" class="connection-meta">
      <div v-if="connectionMeta.image" class="connection-image">
        <img :src="connectionMeta.image" />
      </div>
      <div v-if="connectionMeta.title" class="connection-title">
        {{ connectionMeta.title }}
      </div>
    </div>
    <div v-else class="connection-meta-placeholder loading"></div>
  </a>
</template>

<script lang="ts">
import { defineComponent, ref } from "@vue/composition-api";
import { Connection } from "@/types/connection";
import { linkService } from "@/services/dataService";
import { Metadata } from "@/types/metadata";

export default defineComponent({
  props: {
    connection: {
      type: Object as () => Connection,
      required: true
    }
  },

  setup(props, { root }) {
    const connectionMeta = ref<Metadata>(null);
    const connectionUrl = props.connection.url;
    if (connectionUrl) {
      linkService
        .scrape(connectionUrl)
        .then(result => {
          if ("error" in result) throw result.error;
          else {
            connectionMeta.value = result.data;
          }
        })
        .catch(err => {
          root.$toasted.error("Error loading connection data");
          console.log(err);
        });
    }

    return {
      connectionMeta
    };
  }
});
</script>
