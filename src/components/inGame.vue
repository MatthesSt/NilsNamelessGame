<template>
  <div v-if="loading">
    <div class="spinner-border spinner-border-sm"></div>
    loading...
  </div>
  <div v-if="!loading">
    <div>{{ game.title }}</div>
    <div>turn: {{ game.turns }} || Your turn: {{ player == game.player ? "yes" : "no" }}</div>
    <div id="game" class="d-flex m-3 justify-content-center">
      <div id="self" class="">
        <div class="selfSection">
          <div v-if="self" class="d-flex m-2 row">
            <div style="border-bottom: 1px solid black">{{ self.name }}</div>
            <div>deck: {{ self.deck.name }}</div>
            <div>cards: {{ self.deck.cards.length }}</div>
          </div>
          <div>
            <button class="btn btn-info shadow-none" @click="draw()">draw</button>
            <div class="d-flex">
              <div class="tile" v-for="card in self.handcards" :key="card.id" @mouseover="largeCard = card" @mouseleave="largeCard = null">
                <div>{{ card.name }}</div>
                <div>{{ card.description }}</div>
                <div>{{ card.type }}</div>
              </div>
            </div>
          </div>
          <div class="d-flex align-items-center flex-column mt-2">
            <div>Ablagestapel:</div>
            <div class="tile">{{ self.discarded.length }}</div>
          </div>
          <div>{{ largeCard }}</div>
        </div>
      </div>
      <div class="playerStrategy">
        <div v-for="tile in 9" :key="tile">
          <div class="tile">0,{{ tile }}</div>
        </div>
      </div>
      <div id="field" class="d-flex flex-column align-items-center">
        <div v-for="row in 9" :key="row" class="row">
          <div class="d-flex">
            <div v-for="tile in 5" :key="tile" class="">
              <div class="tile">{{ tile }},{{ row }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="playerStrategy">
        <div v-for="tile in 9" :key="tile">
          <div class="tile">6,{{ tile }}</div>
        </div>
      </div>
      <div id="enemy" class="">
        <div class="enemySection">
          <div v-if="self" class="d-flex m-2 row">
            <div style="border-bottom: 1px solid black">{{ self.name ?? "enemy" }}</div>
            <div class="">deck: {{ self.deck.name }}</div>
            <div>cards: {{ self.deck.cards.length }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import * as API from "../../API";
import { currentUser } from "@/router";

Object.defineProperty(Array.prototype, "shuffle", {
  value: function () {
    for (let i = this.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this[i], this[j]] = [this[j], this[i]];
    }
    return this;
  },
});
declare global {
  interface Array<T> {
    shuffle(): Array<T>;
  }
}

export default defineComponent({
  props: {
    playing: {
      type: String,
      required: true,
    },
  },
  setup() {
    return { currentUser };
  },
  data() {
    return {
      loading: true,
      game: null as unknown as API.game,
      enemy: null as unknown as API.Player,
      self: null as unknown as API.Player,
      cards: [] as API.card[],
      player: 1,

      largeCard: null as API.card | null,

      allowed: true,
    };
  },
  async mounted() {
    await this.setup();
    this.loading = false;
    if (this.allowed) this.turn();

    console.log({ self: this.self, enemy: this.enemy });
  },
  methods: {
    //setup
    async setup() {
      console.log("setup");
      this.cards = await API.getCards();
      this.game = (await API.getGames()).find((game: API.game) => (game.id = this.playing));
      console.log(this.game);
      switch (this.currentUser?.uid) {
        case this.game.user1.id:
          this.self = this.game.user1;
          this.enemy = this.game.user2;
          this.player = 1;
          break;
        case this.game.user2.id:
          this.enemy = this.game.user1;
          this.self = this.game.user2;
          this.player = 2;
          break;
        default:
          window.location.hash = "";
          this.$router.push("/Main");
      }
      this.self.handcards = [] as API.card[];
      this.self.discarded = [] as API.card[];
    },
    //turn
    turn() {
      console.log("turn");
      this.draw();
    },
    //cards
    draw() {
      for (let i = 0; i < 5; i++) {
        if (this.self.deck.cards.length > 0) {
          let drawn = this.getCard();
          if (drawn) this.self.handcards.push(drawn);
          console.log(this.self.handcards);
        } else {
          return;
          //TODO: ablagestapel nachmischen
        }
      }
    },
    getCard(): API.card | undefined {
      if (!this.self.deck.cards) return;
      this.self.deck.cards.shuffle();
      let drawn = this.self.deck.cards.pop();
      if (!drawn) return;
      return this.cards.find(card => card.id == drawn?.id);
    },
  },
});
</script>
<style lang="scss">
.tile {
  $size: 90px;
  border: 1px solid black;
  min-width: $size;
  max-width: $size;
  height: $size;
}
.cardDisplay {
  $size: 200px;
  border: 1px solid black;
  min-width: $size;
  max-width: $size;
  height: $size;
}
.selfSection {
  border: 2px solid black;
  height: 100%;
  max-width: 900px;
  min-width: 900px;
}
.enemySection {
  border: 2px solid black;
  height: 100%;
  max-width: 900px;
}
.playerStrategy {
  border: 2px solid green;
}
#field {
  border: 2px solid blue;
}
</style>
