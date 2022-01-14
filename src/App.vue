<template>
  <nav v-if="currentUser && !playing" class="d-flex justify-content-around" style="width: 100%; border-bottom: 1px solid black">
    <a @click="$router.push('/DeckEditor')">deck editor</a>
    <a @click="$router.push('/LayoutEditor')">layout editor</a>
    <a @click="$router.push('/CardEditor')">card editor</a>
    <a @click="$router.push('/Game')">game</a>
    <div>{{ currentUser.username }}</div>
    <a @click="logout()">logout</a>
  </nav>
  <router-view />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import * as API from "../API";
import { currentUser } from "@/router";
import { playing } from "@/state";

export default defineComponent({
  setup() {
    return { currentUser, playing };
  },
  data() {
    return {
      Username: "",
    };
  },
  methods: {
    async logout() {
      await API.logout();
      this.$router.push("/");
    },
  },
});
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
