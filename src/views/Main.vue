<template>
  <nav class="d-flex justify-content-around" style="width: 100%; border-bottom: 1px solid black">
    <a @click="$router.push('/DeckEditor')">deck editor</a>
    <a @click="$router.push('/LayoutEditor')">layout editor</a>
    <a>create game</a>
    <a>find game</a>
    <div>{{ Username }}</div>
    <a @click="logout()">logout</a>
  </nav>
  <div class="container d-flex align-items-center justify-content-center" style="height: 100vh"></div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import * as API from "../../API";

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
a {
  text-decoration: none !important;
  color: black !important;
  cursor: pointer;
}
</style>
