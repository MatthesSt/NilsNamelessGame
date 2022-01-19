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
          <div v-if="self" class="d-flex m-2 justify-content-around">
            <div>{{ self.name }}</div>
            <div>
              <div>deck: {{ self.deck.name }}</div>
              <div>cards: {{ self.deck.cards.length }}</div>
            </div>
            <div>mana: {{ self.mana }}</div>
          </div>
          <div>
            <button class="btn btn-info shadow-none" @click="draw()">draw</button>
            <button class="btn btn-info shadow-none" @click="skip()">skip</button>
            <div class="d-flex">
              <div
                class="tile"
                v-for="card in self.handcards"
                :key="card.id"
                @mouseover="largeCard = [card]"
                @mouseleave="largeCard = null"
                @click="enableTiles(card)"
              >
                <div>{{ card.name }}</div>
                <div>{{ card.description }}</div>
                <div>{{ card.type }}</div>
              </div>
            </div>
          </div>
          <div class="row d-flex">
            <div v-if="largeCard?.length != 0">
              <div class="" v-for="card in largeCard" :key="card.id">
                <div>{{ card?.name }}</div>
                <div>cost:{{ card?.manacost }} typ:{{ card?.type }}</div>
                <div>R:{{ card?.range }} || M:{{ card?.movement }} || HP:{{ card?.hp }} || A:{{ card?.armor }} || TP:{{ card?.tp }}</div>
                <div>up:{{ card.up }}||left:{{ card.left }}||right:{{ card.right }}||down:{{ card.down }}</div>
              </div>
            </div>
            <div class="d-flex align-items-center flex-column mt-2">
              <div>Ablagestapel:</div>
              <div class="tile" @mouseover="selfDiscarded = self.discarded" @mouseleave="selfDiscarded = []">{{ self.discarded.length }}</div>
            </div>
            <div class="d-flex m-3">
              <div class="" v-for="card in selfDiscarded" :key="card.id">| {{ card.name }} |</div>
            </div>
          </div>
        </div>
      </div>
      <div class="playerStrategy">
        <div v-for="tile in 9" :key="tile">
          <div class="tile">0,{{ tile }}</div>
        </div>
      </div>
      <!-- map -->
      <div id="field" class="d-flex flex-column align-items-center">
        <div v-for="(row, rowIndex) in mapLayout" :key="row[rowIndex]?.type" class="row">
          <div class="d-flex">
            <div v-for="(tile, tileIndex) in row" :key="row[tileIndex].type" class="">
              <div
                @click="placeCard(tileIndex, rowIndex)"
                class="tile"
                :class="placeable.find(t => t == tile.type) || equipable.fields?.find(f => f.y == rowIndex && f.x == tileIndex) ? 'placeable' : ''"
              >
                <div
                  @click="game.usedTiles.find(t => t.x == tileIndex && t.y == rowIndex)?.cards ? 
                    enableTiles(game.usedTiles.find(t => t.x == tileIndex && t.y == rowIndex)!.cards[0],tileIndex,rowIndex) : null"
                  class="tile"
                  @mouseover="largeCard = game.usedTiles.find(t => t.x == tileIndex && t.y == rowIndex)?.cards || null"
                  @mouseleave="largeCard = null"
                  :style="
                    player == 1
                      ? game.usedTiles.find(t => t.x == tileIndex && t.y == rowIndex)?.player == 1 || tile.type == 'playerOnecrystal'
                        ? 'background-color:rgba(0,0,255,0.7);'
                        : game.usedTiles.find(t => t.x == tileIndex && t.y == rowIndex)?.player == 2 || tile.type == 'playerTwocrystal'
                        ? 'background-color:rgba(255,0,0,0.7);'
                        : ''
                      : player == 2
                      ? game.usedTiles.find(t => t.x == tileIndex && t.y == rowIndex)?.player == 2 || tile.type == 'playerTwocrystal'
                        ? 'background-color:rgba(0,0,255,0.7);'
                        : game.usedTiles.find(t => t.x == tileIndex && t.y == rowIndex)?.player == 1 || tile.type == 'playerOnecrystal'
                        ? 'background-color:rgba(255,0,0,0.7);'
                        : ''
                      : ''
                  "
                >
                  {{
                    game.usedTiles.find(t => t.x == tileIndex && t.y == rowIndex)?.cards.map(c => `${c.name}`) ||
                    (tile.type == "playerOnecrystal" || tile.type == "playerTwocrystal" ? "crystal" : "")
                  }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--  -->
      <div class="playerStrategy">
        <div v-for="tile in 9" :key="tile">
          <div class="tile">6,{{ tile }}</div>
        </div>
      </div>
      <div id="enemy" class="">
        <div class="enemySection">
          <div v-if="enemy" class="d-flex m-2 row">
            <div style="border-bottom: 1px solid black">{{ enemy.name ?? "enemy" }}</div>
            <div class="">deck: {{ enemy.deck.name }}</div>
            <div>cards: {{ enemy.deck.cards.length }}</div>
            <div>handcards: {{ enemy.handcards?.length || 0 }}</div>
            <div>mana: {{ enemy.mana || 0 }}</div>
            <div class="d-flex align-items-center flex-column mt-2">
              <div>Ablagestapel:</div>
              <div class="tile" @mouseover="enemyDiscarded = enemy.discarded" @mouseleave="enemyDiscarded = []">
                {{ enemy.discarded?.length || 0 }}
              </div>
            </div>
            <div v-if="enemyDiscarded" class="d-flex m-3">
              <div class="" v-for="card in enemy.discarded" :key="card.id">{{ card.name }}||</div>
            </div>
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
      //setup
      mapLayout: [
        [
          { type: "playerOnecrystal", hp: 20 },
          { type: "playerOnecrystal", hp: 20 },
          { type: "playerOnecrystal", hp: 20 },
        ],
        [{ type: "playerOnespawn" }, { type: "playerOnespawn" }, { type: "playerOnespawn" }],
        [{ type: "playerOnespawn" }, { type: "playerOnespawn" }, { type: "playerOnespawn" }],
        [{ type: "battle" }, { type: "battle" }, { type: "battle" }],
        [{ type: "battle" }, { type: "battle" }, { type: "battle" }],
        [{ type: "battle" }, { type: "battle" }, { type: "battle" }],
        [{ type: "playerTwospawn" }, { type: "playerTwospawn" }, { type: "playerTwospawn" }],
        [{ type: "playerTwospawn" }, { type: "playerTwospawn" }, { type: "playerTwospawn" }],
        [
          { type: "playerTwocrystal", hp: 20 },
          { type: "playerTwocrystal", hp: 20 },
          { type: "playerTwocrystal", hp: 20 },
        ],
      ],

      loading: true,
      game: null as unknown as API.game,
      enemy: null as unknown as API.Player,
      self: null as unknown as API.Player,
      side: "", // playerOne || playerTwo
      cards: [] as API.card[],
      largeCard: null as API.card[] | null, //hover display of handcards

      //game
      player: 1, //whos turn it is -> gamestate
      roundstart: true, //does my round start

      choseMove: false, //waiting for card to get played
      placeable: [] as string[], // placeable tiles
      moveable: [] as API.point[], // tiles were the unit can move to
      equipable: [] as unknown as API.equipable, // equipable tiles
      selected: null as unknown as API.card, //selected card

      enemyDiscarded: [] as API.card[], // Ablagestapel gegner
      selfDiscarded: [] as API.card[], // eigener ablagestapel

      managain: 0, //+1 for each crystal field manacrystals
    };
  },
  async mounted() {
    await this.setup();
    this.loading = false;
    this.game.next ? this.round() : this.player == this.game.player ? this.turn() : null;

    console.log({ self: this.self, enemy: this.enemy });
    console.log(this.game.usedTiles);
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
          this.side = "playerOne";
          break;
        case this.game.user2.id:
          this.enemy = this.game.user1;
          this.self = this.game.user2;
          this.side = "playerTwo";
          this.player = 2;
          break;
        default:
          window.location.hash = "";
          this.$router.push("/Main");
      }
      this.self.handcards = [] as API.card[];
      this.self.discarded = [] as API.card[];
      this.self.mana = 0;

      this.mapLayout.forEach(r => r.forEach(t => (t.type == this.side + "crystal" ? (this.managain += 1) : null)));

      console.log("setup done");
    },
    //round
    round() {
      if (this.roundstart) {
        this.game.turns += 1;
        this.self.mana + this.managain > 6 ? (this.self.mana = 6) : (this.self.mana += this.managain);
        this.draw();
      }
      this.turn();
    },
    //turn
    turn() {
      console.log("turn");
      this.choseMove = true;
    },
    enableTiles(selectedCard: API.card, x?: number, y?: number) {
      if (!this.choseMove) return;
      if (this.self.mana - selectedCard.manacost < 1) return;

      switch (x != undefined && y != undefined) {
        case false:
          switch (selectedCard.type) {
            case "unit":
              this.placeable = [this.side + "spawn"];
              break;
            case "event":
              this.placeable = ["playerOnespawn", "battle", "playerTwospawn"];
              break;
            case "equipment":
              // this.game.usedTiles.forEach((t, i) => {
              //   this.equipable.fields.push({ x: t.x, y: t.y });
              // });
              break;
          }
          break;
        case true:
          if (!x || !y) return;
          this.selected = selectedCard;
          this.mapLayout.forEach((r, rIndex) =>
            r.forEach((t, tIndex) => {
              Math.abs(x - tIndex) <= this.selected.movement && Math.abs(y - rIndex) <= this.selected.movement
                ? this.moveable.push({ x: tIndex, y: rIndex })
                : null;
            })
          );
          this.moveable;
          break;
      }
    },
    placeCard(tile: number, row: number) {
      if (!this.choseMove) return;
      if (typeof this.placeable[0] === "string") if (!this.placeable.find(t => t == this.mapLayout[row][tile].type)) return;

      let pickedTile = this.game.usedTiles.find(t => t.x == tile && t.y == row);
      if (pickedTile?.cards == undefined) this.game.usedTiles.push({ x: tile, y: row, cards: [{ ...this.selected }], player: this.player });
      //TODO: pushes undefined atm
      else return;

      this.choseMove = false;
      this.self.mana -= this.selected.manacost;
      this.placeable = [];

      this.removeHandCard(this.selected);
      this.turnend();
    },
    skip() {
      this.choseMove = false;
      this.placeable = [];
      this.turnend();
    },
    async turnend() {
      // this.self.handcards.forEach(c => (this.player == 1 ? this.game.user1.discarded.push(c) : this.game.user2.discarded.push(c)));
      // this.self.handcards = [];
      this.player == 1 ? (this.game.player = 2) : (this.game.player = 1);
      await API.updateGame(this.game);
    },
    roundend() {
      this.game.next = false;
    },
    //cards
    draw() {
      console.log("draw");
      for (let i = 0; i < 5; i++) {
        if (this.self.deck.cards.length > 0) {
          let drawn = this.getCard();
          if (drawn) this.self.handcards.push(drawn);
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
      let card = this.cards.find(card => card.id == drawn?.id);
      if (card && this.player == 1) {
        console.log("initial", card);
        let up = card.up;
        let down = card.down;
        card.up = down;
        card.down = up;
        console.log("swapped", card);
        return card;
      } else {
        console.log("else", card);
        return card;
      }
    },
    removeHandCard(card: API.card) {
      let index = this.self.handcards.findIndex(c => c.id == card.id);
      this.self.handcards.splice(index, 1);
    },
    //log
    log(st: any, nd?: any) {
      console.log(st, nd);
    },
  },
});
</script>
<style lang="scss">
.tile {
  border: 1px solid black;
  $size: 90px;
  min-width: $size;
  max-width: $size;
  height: $size;
}
.placeable {
  background-color: #0b8100;
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
