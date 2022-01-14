<template>
  <div v-if="!playing">
    <Navbar />
    <form class="m-5" @submit.prevent="createGame()">
      <input type="text" placeholder="gameTitle" v-model="newGame" />
      <!-- <input type="text" placeholder="layout" /> -->
      <button type="submit" class="btn btn-success p-1 ms-1">create game</button>
    </form>
    <div v-if="userMsg" :class="msgType">{{ userMsg }}</div>
    <div>
      <ul style="list-style-type: none">
        <li v-for="game in games" :key="game">
          <div id="gameCard" class="m-4 p-2" style="border: 1px solid #00bb55">
            <p>ID: {{ game.id }}</p>
            <div class="row">
              <div class="col-4">Player 1:</div>
              <div class="col-8">{{ game.user1.name }}</div>
            </div>
            <div class="row">
              <div class="col-4">Player 2:</div>
              <div class="col-8">{{ game.user2.name }}</div>
            </div>
            <div class="row">
              <div class="col-4">Selected Deck:</div>
              <div v-if="game.user1.id == currentUser?.uid" class="col-8">{{ game.user1.deck?.name }}</div>
              <div v-else-if="game.user2.id == currentUser?.uid" class="col-8">{{ game.user2.deck?.name }}</div>
              <div v-else class="col-8">
                <select v-model="selectedDeck">
                  <option disabled value="">Please select a deck</option>
                  <option v-for="deck in decks" :key="deck" :value="deck">{{ deck.name }}</option>
                </select>
              </div>
            </div>
            <button
              v-if="game.user1.id == currentUser?.uid || game.user2.id == currentUser?.uid"
              class="btn btn-info w-50 mt-3 mb-2"
              @click="play(game.id)"
            >
              play
            </button>
            <button v-else class="btn btn-info w-50 mt-3 mb-2" @click="join(game.id)">join</button>
          </div>
        </li>
      </ul>
    </div>
  </div>
  <div v-if="playing">
    <inGame :playing="playing" />
  </div>
</template>
<script lang="ts">
import inGame from "@/components/inGame.vue";
import Navbar from "@/components/nav.vue";

import { defineComponent } from "vue";
import * as API from "../../API";
import { currentUser } from "../router";
import * as State from "@/state";

export default defineComponent({
  setup() {
    return { currentUser };
  },
  data() {
    return {
      newGame: "",
      games: [] as API.game[],
      allowed: false,
      playing: "",
      decks: [] as API.deck[],
      selectedDeck: {} as API.deck,
      userMsg: "",
      msgType: "",
    };
  },
  components: {
    inGame: inGame,
    Navbar: Navbar,
  },
  watch: {
    userMsg() {
      if (this.userMsg) setTimeout(() => (this.userMsg = ""), 2000);
    },
  },
  async mounted() {
    this.games = await API.getGames();
    this.decks = await API.getDecks();
  },
  methods: {
    async createGame() {
      try {
        await API.createGame(this.newGame);
        this.newGame = "";
        this.games = await API.getGames();
      } catch (e) {
        console.log({ error: e, game_vue: "createGame" });
      }
    },
    async join(gameID: string) {
      if (!this.selectedDeck.name) {
        this.msgType = "alert alert-danger";
        this.userMsg = "please select a deck";
        return;
      }
      try {
        console.log(gameID, this.currentUser?.uid);
        await API.joinGame(gameID, this.currentUser!.uid, this.currentUser!.username, this.selectedDeck);
        this.games = await API.getGames();
      } catch (e) {
        console.log({ error: e, Game: "join" });
      }
    },
    play(gameID: string) {
      console.log({ play: gameID });
      State.playing.value = gameID;
      this.playing = gameID;
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
