<template>
  <nav class="d-flex justify-content-around" style="width: 100%; border-bottom: 1px solid black">
    <a @click="$router.push('/DeckEditor')">deck editor</a>
    <a @click="$router.push('/LayoutEditor')">layout editor</a>
    <a @click="$router.push('/CardEditor')">card editor</a>
    <a @click="$router.push('/Game')">game</a>
    <div>{{ currentUser?.username }}</div>
    <a @click="logout()">logout</a>
  </nav>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { currentUser } from "@/router";
import * as API from "../../API";

export default defineComponent({
  setup() {
    return { currentUser };
  },
  methods: {
    async logout() {
      try {
        await API.logout();
      } catch (e) {
        console.log({ error: e });
      }
    },
  },
});
</script>
<style lang="scss"></style>
