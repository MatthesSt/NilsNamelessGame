<template>
  <div id="field" class="row">
    <div class="col">test</div>
    <div class="container col d-flex flex-column align-items-center">
      <div v-for="row in 10" :key="row" class="row">
        <div class="d-flex">
          <div v-for="tile in 10" :key="tile" class="">
            <div id="tile">{{ tile }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="col">abc</div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import * as API from "../../API";

export default defineComponent({
  data() {
    return {
      game: "" as any,
      allowed: false,
    };
  },
  async mounted() {
    this.game = await JSON.stringify(API.getGames());
    console.log(this.game);
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
