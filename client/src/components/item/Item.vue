<template>
  <div v-if="item" class="wide-container section">
    <section class="">
      <h1 class="title">{{ item.name }}</h1>
      <div v-if="item.body" v-html="item.body" class="content"></div>
    </section>

    <item-list :connectedWithItem="item.id" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "@vue/composition-api";
import { Item } from "@/types/item";
import { itemService } from "@/services/dataService";
import ItemList from "@/components/item/ItemList.vue";

export default defineComponent({
  name: "Item",
  props: {
    id: {
      type: Number as () => number,
      required: true
    }
  },
  components: {
    ItemList
  },

  setup(props, { root }) {
    const item = ref<Item>(null);
    const loadItem = async () => {
      const result = await itemService.getById(props.id);
      if ("error" in result) {
        root.$toasted.error("Error loading item");
        console.log(result.error);
      } else item.value = result.data;
    };
    loadItem();

    // watch for id change
    watch(() => props.id, loadItem);

    return {
      item,
      loadItem
    };
  }
});
</script>
