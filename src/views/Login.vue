<template>
  <div class="container d-flex align-items-center justify-content-center" style="height: 100vh">
    <div class="card">
      <div class="card-header">Login</div>
      <div class="card-body">
        <div v-if="register == false">
          <form @submit="login()">
            <div>
              <input class="rounded-pill" type="email" placeholder="email@email.stuff" style="padding-left: 10px" v-model="email" required />
              <input class="rounded-pill" type="password" placeholder="password" style="padding-left: 10px" v-model="password" required />
            </div>
            <div class="d-flex justify-content-start pt-3">
              <button class="me-3" type="submit">login</button>
              <button @click="register = true" type="button">create account</button>
            </div>
          </form>
        </div>
        <div v-if="register">
          <form @submit="createAcc()">
            <div>
              <input class="rounded-pill" type="email" placeholder="email@email.stuff" style="padding-left: 10px" v-model="email" required />
              <input
                class="rounded-pill"
                type="password"
                placeholder="password"
                style="padding-left: 10px"
                v-model="password"
                required
                minlength="6"
              />
              <input v-if="register" class="rounded-pill" type="text" placeholder="username" style="padding-left: 10px" v-model="username" required />
            </div>
            <div class="d-flex justify-content-start pt-3">
              <button class="me-3" type="submit">register</button>
              <button @click="register = false" type="button">login instead</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import * as API from "../../API";

export default defineComponent({
  data() {
    return {
      email: "",
      password: "",
      username: "",
      register: false,
    };
  },
  mounted() {
    localStorage.getItem("Username") ? this.$router.push("/Main") : null;
  },
  methods: {
    async login() {
      console.log("login");
      try {
        await API.login(this.email, this.password);
        this.$router.push("/Main");
      } catch (e) {
        console.log({ error: e });
      }
    },
    createAcc() {
      console.log("register");
      try {
        API.register(this.email, this.password, this.username);
      } catch (e) {
        console.log({ error: e });
      } finally {
        this.email = "";
        this.password = "";
        this.username = "";
      }
      this.$router.push("/Main");
    },
  },
});
</script>
