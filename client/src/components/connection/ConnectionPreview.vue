<template>
  <div v-if="connection" class="connection-preview">
    <div class="box connection-name has-background-white-ter">
      <h1 class="title is-4">{{ connection.name }}</h1>
    </div>

    <div class="items">
      <router-link
        :to="{ name: 'Item', params: { id: connection.item1.id } }"
        class="item box first"
      >
        <h2 class="title is-4 item-name">{{ connection.item1.name }}</h2>
        <template v-if="connection.item1.url">
          <template v-if="item1Meta">
            <div class="item-meta">
              <h2 v-if="item1Meta.title" class="title is-6">
                {{ item1Meta.title }}
              </h2>
            </div>
            <div v-if="item1Meta.image" class="item-image">
              <img :src="item1Meta.image" />
            </div>
          </template>
          <template v-else>
            <div class="item-meta-placeholder loading"></div>
          </template>
        </template>
      </router-link>

      <router-link
        :to="{ name: 'Item', params: { id: connection.item2.id } }"
        class="item box second"
      >
        <h2 class="title is-4 item-name">{{ connection.item2.name }}</h2>
        <template v-if="connection.item2.url">
          <template v-if="item2Meta">
            <div class="item-meta">
              <h2 v-if="item2Meta.title" class="title is-6">
                {{ item2Meta.title }}
              </h2>
            </div>
            <div v-if="item2Meta.image" class="item-image">
              <img :src="item2Meta.image" />
            </div>
          </template>
          <template v-else>
            <div class="item-meta-placeholder loading"></div>
          </template>
        </template>
      </router-link>
    </div>

    <connection-meta v-if="connection.url" :connection="connection" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "@vue/composition-api";
import { Connection } from "@/types/connection";
import { linkService } from "@/services/dataService";
import { Metadata } from "@/types/metadata";
import ConnectionMeta from "@/components/connection/ConnectionMeta.vue";

export default defineComponent({
  name: "ConnectionPreview",
  props: {
    connection: {
      type: Object as () => Connection,
      required: true
    }
  },
  components: {
    ConnectionMeta
  },

  setup(props, { root }) {
    const item1Meta = ref<Metadata>(null);
    const item2Meta = ref<Metadata>(null);

    const item1Url = props.connection.item1.url;
    if (item1Url) {
      linkService
        .scrape(item1Url)
        .then(result => {
          if ("error" in result) throw result.error;
          else {
            item1Meta.value = result.data;
          }
        })
        .catch(err => {
          root.$toasted.error("Error loading item data");
          console.log(err);
        });
    }

    const item2Url = props.connection.item2.url;
    if (item2Url) {
      linkService
        .scrape(item2Url)
        .then(result => {
          if ("error" in result) throw result.error;
          else {
            item2Meta.value = result.data;
          }
        })
        .catch(err => {
          root.$toasted.error("Error loading item data");
          console.log(err);
        });
    }

    return {
      item1Meta,
      item2Meta
    };
  }
});
</script>
