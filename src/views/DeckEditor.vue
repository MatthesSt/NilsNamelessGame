<template>
  <div class="container mt-5">
    <div class="card d-flex">
      <div class="card-header">Decks</div>
      <div class="card-body">
        <div><button class="btn btn-secondary rounded-pill" type="button" @click="createDeck = true">create new Deck</button></div>
        <div>
          <form class="d-flex m-5">
            <div>
              <input type="text" placeholder="name" required />
            </div>
            <div></div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  data() {
    return {
      createDeck: false,
    };
  },
});
</script>

<style lang="scss"></style>
