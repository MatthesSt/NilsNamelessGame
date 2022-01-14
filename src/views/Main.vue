<template>
  <Navbar />
  <div></div>
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

<style lang="scss">
a {
  text-decoration: none !important;
  color: black !important;
  cursor: pointer;
}
</style>
