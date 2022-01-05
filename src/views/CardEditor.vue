<template>
  <div class="container">
    <div class="card mx-auto m-5" id="CreateCard">
      <div class="card-header">create new Card</div>
      <div class="card-body">
        <form @submit.prevent="createCard()" class="m-5 mt-4">
          <div class="row ps-5">
            <input class="col-3" type="text" placeholder="cardname" v-model="name" required />
            <input class="col-3" type="text" placeholder="description" v-model="description" required />
          </div>
          <div class="row mt-4 ps-1">
            <div class="col-3">
              <label for="type" class="me-2">Card type:</label>
              <select name="type" placeholder="type" v-model="type" required>
                <option value="unit">Einheit</option>
                <option value="strategy">Strategiekarte</option>
                <option value="nebula">Nebel</option>
                <option value="equipment">Ausrüstung</option>
                <option value="event">Event</option>
              </select>
            </div>
            <div class="col-3">
              <label for="discard" class="me-2">single use ?</label>
              <select name="discard" v-model="discardAfterUser" required>
                <option value="true">discard after use</option>
                <option value="false">keep</option>
              </select>
            </div>
            <div class="col-3">
              <label for="mana" class="me-2">manacost:</label>
              <input name="mana" type="number" placeholder="manacost" v-model="manacost" max="10" min="0" required />
            </div>
          </div>

          <div class="row mt-4 ps-1">
            <div class="col-2">
              <label for="hp" class="me-2">hp:</label>
              <input name="hp" placeholder="hp" type="number" required v-model="hp" max="50" min="0" />
            </div>
            <div class="col-2">
              <label for="armor" class="me-2">armor:</label>
              <input name="armor" placeholder="armor" type="number" required v-model="armor" max="50" min="0" />
            </div>
            <div class="col-2">
              <label for="movement" class="me-2">movement:</label>
              <input name="movement" placeholder="movement" type="number" required v-model="movement" max="10" min="0" />
            </div>

            <div class="col-2">
              <label for="range" class="me-2">range:</label>
              <input name="range" placeholder="range" type="number" required v-model="range" max="10" min="0" />
            </div>
            <div class="col-2">
              <label for="tp" class="me-2">tp:</label>
              <input name="tp" placeholder="tp" type="number" required v-model="tp" max="50" min="0" />
            </div>
          </div>
          <button type="submit" class="btn btn-success mt-4">create Card</button>
        </form>
      </div>
    </div>
    <div id="list">
      <div class="card">
        <div class="card-body d-flex">
          <div class="col-4" v-for="card of cards" :key="card.id">
            <div id="top"></div>
            <div id="middle">{{ card.manacost }} test</div>
            <div id="bottom"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import * as API from "../../API";
import type { card } from "../../API";

export default defineComponent({
  data() {
    return {
      name: "",
      description: "",
      manacost: 0,
      type: "" as "unit" | "strategy" | "nebula" | "equipment" | "event",
      discardAfterUser: false,
      hp: 0,
      armor: 0,
      movement: 0,
      range: 0,
      tp: 0,
      effect: "" as any,
      up: "" as any,
      left: "" as any,
      right: "" as any,
      down: "" as any,

      cards: [] as card[],
    };
  },
  async mounted() {
    try {
      this.cards = await API.getCards();
    } catch (e) {
      console.log({ error: e });
    }
  },
  methods: {
    async createCard() {
      let newCard = {
        name: this.name,
        description: this.description,
        manacost: this.manacost,
        type: this.type,
        discardAfterUser: this.discardAfterUser,
        hp: this.hp,
        armor: this.armor,
        movement: this.movement,
        range: this.range,
        tp: this.tp,
        effect: "" as any,
        up: "" as any,
        left: "" as any,
        right: "" as any,
        down: "" as any,
      };
      console.log({ newCard: newCard });
      try {
        await API.setCard(newCard);
      } catch (e) {
        console.log({ error: e });
      }
    },
  },
});
</script>
<style lang="scss"></style>
