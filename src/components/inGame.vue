<template>
  <div id="game" class="d-flex m-3 justify-content-center">
    <div id="self" class="">
      <div class="playerSection">
        <div>{{ self.username }}</div>
        <div class="tile m-2">deck: {{ self.deck }}</div>
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
      <div class="playerSection">
        <div>{{ game.user2?.name ?? "enemy" }}</div>
        <div class="tile m-2">deck</div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import * as API from "../../API";
import { currentUser } from "@/router";

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
      game: {} as API.game,
      enemy: {} as API.Player,
      self: {} as API.Player,
      allowed: false,
    };
  },
  async mounted() {
    this.game = (await API.getGames()).find((game: API.game) => (game.id = this.playing));
    console.log(this.game);
    switch (this.game.user1.id == this.currentUser?.uid) {
      case true:
        this.self = this.game.user1;
        this.enemy = this.game.user2;
        break;
      case false:
        this.enemy = this.game.user1;
        this.self = this.game.user2;
        break;
    }
  },
});
</script>
<style lang="scss">
.tile {
  $size: 90px;
  border: 1px solid black;
  width: $size;
  height: $size;
}
.playerSection {
  border: 2px solid black;
  height: 100%;
}
.playerStrategy {
  border: 1px solid green;
}
#field {
  border: 1px solid blue;
}
</style>
