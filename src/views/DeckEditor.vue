<template>
  <div class="container mt-5">
    <div class="card d-flex">
      <div class="card-header">Decks</div>
      <div class="card-body">
        <div class="d-flex justify-content-around">
          <button
            class="btn btn-secondary rounded-pill"
            type="button"
            @click="
              createDeck = true;
              editDeck = false;
            "
          >
            create new Deck
          </button>
          <button
            class="btn btn-secondary rounded-pill"
            type="button"
            @click="
              createDeck = false;
              editDeck = true;
            "
          >
            edit Deck
          </button>
        </div>

        <div v-if="createDeck">
          <form class="d-flex m-5" @submit.prevent="createNewDeck(newDeckName)">
            <div>
              <input type="text" placeholder="name" required v-model="newDeckName" />
            </div>
            <button type="submit" class="btn btn-success">create Deck</button>
          </form>
        </div>

        <div v-if="editDeck">
          <form class="d-flex m-5" @submit.prevent="openDeck(currentDeck)">
            <div>
              <select type="text" placeholder="name" required v-model="currentDeck">
                <option v-for="deck in decks" :key="deck" :value="deck">{{ deck }}</option>
              </select>
            </div>
            <div>
              <button type="submit" class="btn btn-success">open Deck</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import * as API from "../../API";

export default defineComponent({
  data() {
    return {
      createDeck: false,
      editDeck: false,
      decks: [] as string[],
      currentDeck: "",
      newDeckName: "",
    };
  },
  async mounted() {
    try {
      this.decks = await API.getDecks();
    } catch (e) {
      console.log({ error: e });
    }
  },
  methods: {
    openDeck(Deck: string) {
      console.log(Deck);
    },
    createNewDeck(newDeckName: string) {
      console.log(newDeckName);
    },
  },
});
</script>

<style lang="scss"></style>
