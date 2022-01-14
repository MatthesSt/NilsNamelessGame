<template>
  <div id="field" class="row">
    <div id="player1" class="col">
      <div id="tile"></div>
    </div>
    <div class="container col d-flex flex-column align-items-center">
      <div v-for="row in 10" :key="row" class="row">
        <div class="d-flex">
          <div v-for="tile in 7" :key="tile" class="">
            <div id="tile">{{ tile }},{{ row }}</div>
          </div>
        </div>
      </div>
    </div>
    <div id="player2" class="col">abc</div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import * as API from "../../API";

export default defineComponent({
  props: {
    playing: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      games: [] as API.game[],
      allowed: false,
    };
  },
  async mounted() {
    this.games = await API.getGames();
    console.log(this.games.find(game => (game.id = this.playing)));
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
