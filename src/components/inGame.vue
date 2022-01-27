<template>
  <div v-if="loading">
    <div class="spinner-border spinner-border-sm"></div>
    loading...
  </div>
  <div v-if="!loading" @click.stop="disableTiles()">
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
            <button class="btn btn-info shadow-none" @click.stop="draw(5)">draw</button>
            <button class="btn btn-info shadow-none" @click.stop="game.skipped == 3 ? roundend() : skip()">
              {{ game.skipped ? "initiative ergreifen" : "skip turn" }}
            </button>
            <div class="d-flex">
              <div
                class="tile"
                v-for="card in self.handcards"
                :key="card.id"
                @mouseover="largeCard = [card]"
                @mouseleave="largeCard = null"
                @click.stop="enableTiles(card, 'handcard')"
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
                <div>
                  up:{{ card.up }}
                  <br />
                  left:{{ card.left }}
                  <br />
                  right:{{ card.right }}
                  <br />
                  down:{{ card.down }}
                </div>
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
                @click.stop="placeCard(tileIndex, rowIndex)"
                class="tile"
                :class="selectable.find(t => t.x == tileIndex && t.y == rowIndex) ? 'placeable' : ''"
              >
                <div
                  @click="!selected?.id ? enableTiles(game.usedTiles.find(t => t.x == tileIndex && t.y == rowIndex)!.cards[0],'movement',tileIndex,rowIndex,):null"
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
                    game.usedTiles.find(t => t.x == tileIndex && t.y == rowIndex)?.cards.map(c => `${c.name} hp:${c.hp}`) ||
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
      <div id="enemy">
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
      largeCard: null as unknown as API.card[] | null, //hover display of handcards

      //game
      player: 1, //which player you are
      roundstart: true, //does my round start

      choseMove: false, //waiting for card to get played
      selected: null as unknown as API.card, //selected card
      acting: null as unknown as API.point, //spot from card thats acting
      selectable: [] as API.point[],
      actionType: "" as "handcard" | "movement",

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
  },
  methods: {
    //setup
    async setup() {
      console.log("setup");
      this.cards = await API.getCards();
      this.game = (await API.getGames()).find((game: API.game) => (game.id = this.playing));
      console.log({ game: this.game });
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
      if (this.game.turns == 0) {
        this.self.handcards = [] as API.card[];
        this.self.discarded = [] as API.card[];
        this.self.mana = 0;
      }
      this.game.turns == 1 && this.player == 2 ? (this.self.mana = 3) : null;

      console.log("setup done");
    },
    //round
    round() {
      console.log("round");
      if (this.player == 2) this.game.next = false;
      this.game.turns += 1;
      this.mapLayout.forEach(r => r.forEach(t => (t.type == this.side + "crystal" ? (this.managain += 1) : null)));
      this.self.mana + this.managain > 6 ? (this.self.mana = 6) : (this.self.mana += this.managain);
      this.draw(Math.min(5, this.self.discarded.length + this.self.deck.cards.length));
      this.turn();
    },
    turn() {
      console.log("turn");
      this.choseMove = true;
    },
    async skip() {
      console.log("skip");
      this.choseMove = false;
      this.game.skipped = 3;
      await this.turnend();
    },
    async turnend() {
      console.log("turnend");
      this.disableTiles();

      this.player == 1 ? (this.game.player = 2) : (this.game.player = 1);
      this.player == 1 ? (this.game.user1 = this.self) : (this.game.user2 = this.self);
      await API.updateGame(this.game);
    },
    async roundend() {
      console.log("roundend");
      this.game.next = true;
      this.game.skipped = this.player;
      this.self.handcards.forEach(c => this.self.discarded.push(c));
      this.self.handcards = [];
      await this.turnend();
    },
    //action
    enableTiles(selectedCard: API.card, actiontype: string, x?: number, y?: number) {
      this.disableTiles();
      console.log("enableTiles");
      if (!this.choseMove) return;
      this.selected = selectedCard;

      switch (actiontype) {
        case "handcard":
          this.actionType = actiontype;
          if (this.self.mana - selectedCard.manacost < 0) return;
          switch (selectedCard.type) {
            case "unit":
              this.mapLayout.forEach((r, rIndex) =>
                r.forEach((t, tIndex) => {
                  t.type == this.side + "spawn" ? this.selectable.push({ x: tIndex, y: rIndex }) : null;
                })
              );
              break;
            case "event":
              this.mapLayout.forEach((r, rIndex) =>
                r.forEach((t, tIndex) => {
                  t.type == "playOnespawn" || t.type == "playerTwospawn" || t.type == "battle"
                    ? this.selectable.push({ x: tIndex, y: rIndex })
                    : null;
                })
              );
              break;
            case "equipment":
              // this.game.usedTiles.forEach((t, i) => {
              //   this.equipable.fields.push({ x: t.x, y: t.y });
              // });
              break;
          }
          break;
        case "movement":
          if (!this.game.usedTiles.find(t => t.x == x && t.y == y)?.cards) return;
          console.log("movement");
          this.actionType = actiontype;
          if (this.self.mana < 1) return;
          if (x == undefined || y == undefined) return;
          if (this.game.usedTiles.find(c => c.x == x && c.y == y)?.player != this.player) return;

          this.mapLayout.forEach((r, rIndex) =>
            r.forEach((t, tIndex) => {
              t.type != "playerTwocrystal" && t.type != "playerOnecrystal" && Math.abs(x! - tIndex) + Math.abs(y! - rIndex) <= this.selected.movement
                ? this.selectable.push({ x: tIndex, y: rIndex })
                : null;
            })
          );
          this.acting = this.selectable.find(p => p.x == x && p.y == y)!;
          this.selectable.splice(
            this.selectable.findIndex(p => p.x == x && p.y == y),
            1
          );
          console.log("test", this.selectable);
          break;
      }
    },
    placeCard(tile: number, row: number) {
      console.log("placeCard");

      if (!this.choseMove) return;
      if (!this.Placeable(tile, row)) return;

      let pickedTile = this.game.usedTiles.find(t => t.x == tile && t.y == row);

      switch (this.actionType) {
        case "handcard":
          if (!pickedTile?.cards) {
            this.game.usedTiles.push({ x: tile, y: row, cards: [{ ...this.selected }], player: this.player });
            this.self.mana -= this.selected.manacost;
            this.removeHandCard(this.selected);
          } else return;
          break;
        case "movement":
          if (!pickedTile?.cards) {
            this.game.usedTiles.splice(
              this.game.usedTiles.findIndex(t => t.x == this.acting.x && t.y == this.acting.y),
              1
            );

            this.game.usedTiles.push({ x: tile, y: row, cards: [{ ...this.selected }], player: this.player });
            this.acting = null as unknown as API.point;
          } else {
            if (pickedTile.player != this.player) {
              console.log("attack");
              this.attack({ x: pickedTile.x, y: pickedTile.y }, this.acting);
            }
          }
          break;
      }

      this.choseMove = false;
      this.turnend();
    },
    attack(defender: API.point, attacker: API.point) {
      let TP = this.getTileTP(attacker);
      let A = this.getTileA(defender);
      let tileIndex = this.game.usedTiles.findIndex(t => t.x == defender.x && t.y == defender.y);
      this.game.usedTiles[tileIndex].cards[0].hp -= TP - A > 0 ? TP - A : 0;
      if (this.game.usedTiles[tileIndex].cards[0].hp < 1) this.game.usedTiles.splice(tileIndex, 1);
    },
    getTileA(tile: API.point): number {
      let armor = 0;
      this.game.usedTiles.find(t => t.x == tile.x && t.y == tile.y)?.cards.forEach(c => (armor += c.armor));
      return armor;
    },
    getTileTP(tile: API.point): number {
      let tp = 0;
      this.game.usedTiles.find(t => t.x == tile.x && t.y == tile.y)?.cards.forEach(c => (tp += c.tp));
      return tp;
    },
    disableTiles() {
      console.log("disableTiles");
      this.selected = null as unknown as API.card;
      this.selectable = [];
    },
    Placeable(x: number, y: number): boolean {
      if (this.selectable.find(t => t.x == x && t.y == y)) return true;
      return false;
    },
    //cards
    draw(amount: number) {
      console.log("draw");
      for (let i = 0; i < amount; i++) {
        this.self.handcards.push(this.getCard());
      }
    },
    getDiscarded() {
      this.self.discarded.forEach(d => this.self.deck.cards.push({ id: d.id }));
      this.self.discarded = [];
    },
    getCard(): API.card {
      if (!this.self.deck.cards.length) this.getDiscarded();
      this.self.deck.cards.shuffle();
      let drawn = this.self.deck.cards.pop();
      let card = this.cards.find(card => card.id == drawn?.id);
      if (!card) throw new Error("Card.id not found in getCard()");
      if (this.player == 1) {
        [card.up, card.down] = [card.down, card.up];
      }
      console.log(card);
      return card;
    },
    removeHandCard(card: API.card) {
      let index = this.self.handcards.findIndex(c => c.id == card.id);
      this.self.handcards.splice(index, 1);
    },
    //log
    log(st: any) {
      console.log({ first: st });
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
