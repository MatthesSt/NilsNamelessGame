<template>
  <Navbar />

  <div>test</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Navbar from "@/components/nav.vue";

export default defineComponent({
  data() {
    return {};
  },
  components: {
    Navbar: Navbar,
  },
});
</script>
