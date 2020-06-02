<template>
  <div v-if="item" class="wide-container section item-page">
    <section>
      <div class="title-bar">
        <h1 class="title">{{ item.name }}</h1>
        <div v-if="isAuthenticated" class="options field">
          <router-link
            :to="{
              name: 'EditItem',
              params: { id: item.id }
            }"
            class="button is-small"
          >
            Edit
          </router-link>
          <button @click="deleteItem" class="options button is-small is-danger">
            Delete
          </button>
        </div>
      </div>
      <hr />

      <div v-if="item.body" v-html="item.body" class="content"></div>

      <div v-if="item.metadata" class=" item-page-preview">
        <div v-if="item.metadata.image" class="image">
          <img :src="item.metadata.image" />
        </div>

        <div class="preview-body">
          <h1 v-if="item.metadata.title" class="title is-5">
            {{ item.metadata.title }}
          </h1>
          <p v-if="item.metadata.description">
            {{ item.metadata.description }}
          </p>
          <a :href="item.metadata.url">{{ item.metadata.url }}</a>
        </div>
      </div>
    </section>

    <section class="vertical-pad">
      <item-list
        :connectedWithItem="item.id"
        @connection-deleted="connectionDeleted"
      />
    </section>

    <section v-if="graph">
      <h1 class="title vertical-pad-m">Graph</h1>
      <div v-if="loadGraph">
        <graph :itemId="item.id" />
        <div class="field has-text-centered">
          <button @click="loadGraph = false" class="button is-danger">
            Close
          </button>
        </div>
      </div>
      <div v-else class="field has-text-centered">
        <button @click="loadGraph = true" class="button is-primary">
          Load Graph
        </button>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, computed } from "@vue/composition-api";
import { Item } from "@/types";
import { itemService } from "@/services/dataService";
import { userStore } from "@/store";
import ItemList from "@/components/item/ItemList.vue";
import Graph from "@/components/graph/Graph.vue";

export default defineComponent({
  name: "Item",
  props: {
    id: {
      type: Number as () => number,
      required: true
    },
    graph: {
      type: Boolean as () => boolean
    },
    deleteRedirect: {
      type: Boolean as () => boolean
    }
  },
  components: {
    ItemList,
    Graph
  },

  setup(props, { root, emit }) {
    const isAuthenticated = computed<boolean>(
      userStore.getters.isAuthenticated
    );

    const item = ref<Item>(null);
    const loadItem = async () => {
      const result = await itemService.getById(props.id);
      if ("success" in result) item.value = result.data;
      else root.$toasted.error("Error loading item: " + result.message);
    };
    watch(() => props.id, loadItem);

    const deleteItem = async () => {
      if (confirm("Are you sure you want to delete this item?")) {
        if (!item.value) return;
        const result = await itemService.del(item.value.id);

        if ("success" in result) {
          // emit event
          emit("item-deleted", item.value.id);
          // redirect
          if (props.deleteRedirect) root.$router.push({ name: "Items" });
          // toast
          root.$toasted.success("Item deleted");
        } else root.$toasted.error("Error deleting item: " + result.message);
      }
    };

    const connectionDeleted = (id: number) => {
      if (item.value?.id) {
        emit("connection-deleted", item.value.id, id);
      }
    };

    const loadGraph = ref<boolean>(false);

    return {
      item,
      loadItem,
      deleteItem,
      loadGraph,
      isAuthenticated,
      connectionDeleted
    };
  }
});
</script>

<style lang="scss">
@import "bulmaswatch/cosmo/bulmaswatch.scss";

.item-page {
  padding-left: 0;
  padding-right: 0;

  .network-container {
    max-width: 50rem;
    height: 30rem;
    margin: auto;
  }
}

.title-bar {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  h1.title,
  .title:not(:last-child) {
    margin-bottom: 0;
  }
}

.item-page-preview {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-evenly;
  background-color: $background;

  padding-top: 1.5rem;
  padding-bottom: 1.5rem;

  .image {
    max-width: 20rem;
  }

  .preview-body {
    padding: 0.8rem;
    width: 100%;
    overflow-wrap: break-word;

    @include tablet {
      max-width: 40rem;
    }
  }
}
</style>
