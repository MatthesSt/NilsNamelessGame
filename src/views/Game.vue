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
          <div id="gameCard" class="m-4 p-2" style="border: 1px solid #00bb55">
            <p>ID: {{ game.id }}</p>
            <div class="row">
              <div class="col-3">Player 1:</div>
              <div class="col-8">{{ game.user1.name }}</div>
            </div>
            <div class="row">
              <div class="col-3">Player 2:</div>
              <div class="col-8">{{ game.user2.name }}</div>
            </div>
            <button class="btn btn-info w-50 mt-3 mb-2" @click="join(game.id)">join</button>
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
  setup() {
    return { currentUser };
  },
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
        console.log(gameID, this.currentUser?.uid);
        await API.joinGame(gameID, this.currentUser!.uid, this.currentUser!.username);
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
#gameCard {
  width: 500px;
}
</style>
