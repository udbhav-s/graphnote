<template>
  <section v-if="workspace">
    <div class="wide-container">
      <div class="vertical-pad">
        <h1 class="title">{{ workspace.name }}</h1>
      </div>
      <div class="">
        <router-view />
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, ref } from "@vue/composition-api";
import { workspaceService } from "@/services/dataService";
import { Workspace } from "@/types/workspace";

export default defineComponent({
  name: "Workspace",
  props: {
    id: {
      type: Number as () => number,
      required: true
    }
  },

  setup(props, { root }) {
    const workspace = ref<Workspace>(null);
    onBeforeMount(async () => {
      const result = await workspaceService.getById(props.id);
      if ("error" in result) {
        root.$toasted.error("Error loading workspace");
        throw result.error;
      }
      // set workspace
      workspace.value = result.data;
    });

    return {
      workspace
    };
  }
});
</script>
