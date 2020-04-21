<template>
  <div class="item-preview-container">
    <div
      v-if="item.connection"
      class="box connection-name has-background-white-ter"
    >
      {{ item.connection.name }}
    </div>

    <router-link
      :to="{ name: 'Item', params: { id: item.id } }"
      class="box item-preview"
    >
      <h1 class="title is-5">{{ item.name }}</h1>

      <template v-if="item.url">
        <div v-if="itemMeta" class="item-preview-meta">
          <div class="image">
            <img v-if="itemMeta.image" :src="itemMeta.image" />
          </div>

          <div class="preview-content">
            <h1 v-if="itemMeta.title" class="title is-6">
              {{ itemMeta.title }}
            </h1>

            <p v-if="itemMeta.description" class="description">
              {{ itemMeta.description }}
            </p>
          </div>
        </div>
        <div v-else class="loading"></div>
      </template>
    </router-link>

    <connection-meta
      v-if="item.connection && item.connection.url"
      :connection="item.connection"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "@vue/composition-api";
import { Metadata } from "@/types/metadata";
import { Item } from "@/types/item";
import { linkService } from "@/services/dataService";
import ConnectionMeta from "@/components/connection/ConnectionMeta.vue";

export default defineComponent({
  name: "ItemPreview",
  props: {
    item: {
      type: Object as () => Item,
      required: true
    }
  },
  components: {
    ConnectionMeta
  },

  setup(props, { root }) {
    const itemMeta = ref<Metadata>(null);
    if (props.item.url) {
      linkService
        .scrape(props.item.url)
        .then(result => {
          if ("error" in result) throw result.error;
          else {
            itemMeta.value = result.data;
          }
        })
        .catch(err => {
          root.$toasted.error("Error loading item data");
          console.log(err);
        });
    }

    return {
      itemMeta
    };
  }
});
</script>
