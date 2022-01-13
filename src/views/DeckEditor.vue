<template>
  <div class="container mt-5">
    <div v-if="userMsg" :class="msgType">{{ userMsg }}</div>
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
          <form class="m-5" @submit.prevent="setDeck()">
            <div class="row">
              <input class="col-12" type="text" placeholder="name" required v-model="newDeck.name" />
              <h2 class="text-start col-12">Cards:</h2>
              <div class="col-11 row" v-for="(card, index) in newDeck.cards" :key="card">
                <select class="col-11" style="height: 34px" v-model="card.id">
                  <option v-for="card in cards" :key="card" :value="card.id">{{ card.name }}</option>
                </select>
                <button
                  v-if="index > 0"
                  type="button"
                  class="btn btn-danger col-1 ms-1 p-1"
                  style="border-radius: 50%; width: 34px"
                  @click="deleteEntry(index)"
                >
                  -
                </button>
              </div>
              <button type="button" class="btn btn-success col-1 ms-1 p-1" style="border-radius: 50%; width: 34px" @click="addEntry()">+</button>
              <button type="submit" class="btn btn-success p-1 mt-3 col-7">create Deck</button>
            </div>
          </form>
        </div>

        <div v-if="editDeck">
          <form class="m-5">
            <div class="row">
              <select class="col-4" type="text" placeholder="name" required v-model="currentDeck">
                <option v-for="deck in decks" :key="deck" :value="deck">{{ deck.name }}</option>
              </select>
              <button type="submit" class="btn btn-success col-2 ms-2" @submit.prevent="openDeck()">open Deck</button>
            </div>
          </form>
          <div>
            <div class="row">
              <input class="col-6 offset-3" type="text" placeholder="name" required v-model="currentDeck.name" />
              <div class="col-6 offset-3" v-for="(card, index) in currentDeck.cards" :key="card">
                <select style="height: 34px" class="col-11 mt-2" v-model="currentDeck.cards[index]">
                  <option v-for="card in cards" :key="card" :value="card">{{ card.name }}</option>
                </select>
                <button
                  id="deleteCard"
                  type="button"
                  :class="currentDeck.cards.length > 1 ? 'btn btn-danger col-1 ms-1 p-1' : 'invisible'"
                  style="border-radius: 50%"
                  @click="deleteCard(index)"
                >
                  -
                </button>
              </div>
              <button
                id="addCard"
                type="button"
                class="btn btn-success col-1 ms-1 p-1 mt-2"
                style="border-radius: 50%; width: 34px; heigth: 34px"
                @click="addCard()"
              >
                +
              </button>
            </div>
            <button class="btn btn-success mt-2" type="button" @click.prevent="saveDeck()">save changes</button>
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

export default defineComponent({
  setup() {
    return { currentUser };
  },
  data() {
    return {
      userMsg: "",
      msgType: "",
      createDeck: false,
      editDeck: false,
      decks: [] as API.deck[],
      currentDeck: {} as API.deck,
      newDeck: {
        cards: [{} as API.card],
        name: "",
        size: 1,
      } as API.deck,
      cards: [] as API.card[],
    };
  },
  watch: {
    userMsg() {
      if (this.userMsg) setTimeout(() => (this.userMsg = ""), 2000);
    },
  },
  async mounted() {
    try {
      this.decks = (await API.getDecks()) || [];
      this.cards = (await API.getCards()) || [];
    } catch (e) {
      console.log({ error: e });
    }
  },
  methods: {
    openDeck() {
      // this.currentDeck = ;
    },
    async setDeck() {
      // eslint-disable-next-line no-debugger
      debugger;
      if (this.decks)
        if (this.decks.some(deck => deck.name == this.newDeck.name)) {
          this.userMsg = "deckname already exists";
          this.msgType = "alert alert-danger";
        }
      let newDeckArray = [...this.decks, this.newDeck];
      try {
        await API.setDecks(newDeckArray);
        this.userMsg = "deck created";
        this.msgType = "alert alert-success";
        this.decks = (await API.getDecks()) || [];
      } catch (e) {
        console.log({ error: e, Deck_editor: "createNewDeck" });
      }
    },
    addEntry() {
      this.newDeck.cards.push({} as API.card);
    },
    deleteEntry(i: number) {
      this.newDeck.cards.splice(i, 1);
    },
    deleteCard(i: number) {
      this.currentDeck.cards.splice(i, 1);
    },
    addCard() {
      this.currentDeck.cards.push({} as API.card);
    },
    async saveDeck() {
      let i = this.decks.findIndex(deck => deck.name == this.currentDeck.name);
      let newDeckArray = [...this.decks];
      if (i != -1) {
        newDeckArray[i] = this.newDeck;
      } else {
        newDeckArray.push(this.currentDeck);
      }
      try {
        await API.setDecks(newDeckArray);
      } catch (e) {
        console.log({ error: e, Deck_Editor: "saveDeck" });
      }
      this.decks = await API.getDecks();
    },
  },
});
</script>

<style lang="scss">
#addCard {
  width: 34px;
  height: 34px;
}
#deleteCard {
  width: 34px;
  height: 34px;
}
</style>
