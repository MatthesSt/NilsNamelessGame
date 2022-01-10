<template>
  <div v-if="!playing">
    <form class="m-5" @submit.prevent="createGame()">
      <input type="text" placeholder="gameTitle" v-model="newGame" />
      <!-- <input type="text" placeholder="layout" /> -->
      <button type="submit" class="btn btn-success p-1 ms-1">create game</button>
    </form>
    <div>
      <ul style="list-style-type: none">
        <li v-for="game in games" :key="game">
          <div>
            {{ game }}
            <button class="btn btn-info" @click="join(game.id)">join</button>
          </div>
        </li>
      </ul>
    </div>
  </div>
  <div v-if="playing">
    <inGame />
  </div>
</template>
<script lang="ts">
import inGame from "@/components/inGame.vue";
import { defineComponent } from "vue";
import * as API from "../../API";
import { currentUser } from "../router";

export default defineComponent({
  data() {
    return {
      newGame: "",
      games: [] as API.game[],
      allowed: false,
      playing: false,
    };
  },
  components: {
    inGame: inGame,
  },
  async mounted() {
    this.games = await API.getGames();
    console.log({ games: this.games });
  },
  methods: {
    async createGame() {
      try {
        await API.createGame(this.newGame);
        this.newGame = "";
      } catch (e) {
        console.log({ error: e, game_vue: "createGame" });
      }
    },
    async join(gameID: string) {
      try {
        await API.joinGame(gameID, currentUser.value!.uid);
      } catch (e) {
        console.log({ error: e, Game: "join" });
      }
    },
  },
});
</script>
<style lang="scss">
#tile {
  $size: 90px;
  border: 1px solid black;
  width: $size;
  height: $size;
}
</style>
