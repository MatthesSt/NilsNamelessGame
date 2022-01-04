<template>
  <nav class="d-flex justify-content-around" style="width: 100%; border-bottom: 1px solid black">
    <a @click="$router.push('/DeckEditor')">deck editor</a>
    <a @click="$router.push('/LayoutEditor')">layout editor</a>
    <a @click="$router.push('/CardEditor')">card editor</a>
    <div>{{ Username }}</div>
    <a @click="logout()">logout</a>
  </nav>
  <router-view />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import * as API from "../API";

export default defineComponent({
  data() {
    return {
      Username: "",
    };
  },
  async mounted() {
    try {
      this.Username = await API.getUsername();
      localStorage.setItem("Username", this.Username);
      console.log(this.Username);
    } catch (e) {
      console.log({ error: e });
    }
    if (localStorage.getItem("Username")) this.Username = localStorage.getItem("Username") as string;
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
