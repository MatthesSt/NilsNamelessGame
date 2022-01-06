<template>
  <div class="container">
    <div class="card mx-auto m-5" id="CreateCard">
      <div class="card-header" v-if="!editingCard">create new Card</div>
      <div class="card-header" v-if="editingCard">edit Card</div>
      <div class="card-body">
        <div v-if="setCard" :class="feedbackState">{{ setCard }}</div>
        <form @submit.prevent="createCard()" class="m-5 mt-4">
          <div class="row ps-5">
            <input class="col-3" type="text" placeholder="cardname" v-model="name" required />
            <input class="col-3" type="text" placeholder="description" v-model="description" required />
          </div>
          <div class="row mt-4 ps-1">
            <div class="col-3">
              <label for="type" class="me-2">Card type:</label>
              <select name="type" placeholder="type" v-model="type" required>
                <option value="Einheit">Einheit</option>
                <option value="Strategie">Strategiekarte</option>
                <option value="Nebel">Nebel</option>
                <option value="Ausrüstung">Ausrüstung</option>
                <option value="Event">Event</option>
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
          <button type="submit" class="btn btn-success mt-4" v-if="!editingCard">create Card</button>
          <button type="submit" class="btn btn-success mt-4" v-if="editingCard">save changes</button>
        </form>
      </div>
    </div>
    <div id="list">
      <div class="card">
        <div class="card-body d-flex row">
          <div class="col-4 mb-3" v-for="card of cards" :key="card.id">
            <div class="" style="border: 1px solid black">
              <div class="top row">
                <div class="row">
                  <div class="col-7 p-0">name: {{ card.name }}</div>
                  <div class="col-5 d-flex justify-content-end p-0">
                    <button class="btn btn-warning" type="button" @click="editCard(card)">edit</button>
                    <button class="btn btn-danger" type="button" @click="deleteCard(card)">delete</button>
                  </div>
                </div>
              </div>
              <div class="">description: {{ card.description }}</div>
              <div>single use: {{ card.discardAfterUser ? "yes" : "no" }} | type: {{ card.type }} | Manacost: {{ card.manacost }}</div>
              <div class="">hp:{{ card.hp }} | A:{{ card.armor }} | M:{{ card.movement }} | R: {{ card.range }} | TP:{{ card.tp }}</div>
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
import type { idCard } from "../../API";

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
      id: "",

      cards: [] as idCard[],

      setCard: "",
      feedbackState: "",
      editingCard: false,
    };
  },
  async mounted() {
    try {
      this.cards = await API.getCards();
      console.log(this.cards);
    } catch (e) {
      console.log({ error: e });
    }
  },
  methods: {
    async createCard() {
      let newCard = {
        name: this.name,
        id: this.id ? this.id : this.name + "id",
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
        this.feedbackState = "alert alert-success";
        this.setCard = "Karte wurde gespeichert";
        setTimeout(() => (this.setCard = ""), 2000);
        this.clearInputs();
      } catch (e) {
        console.log({ error: e });
        this.feedbackState = "alert alert-danger";
        this.setCard = "Karte konnte nicht gespeichert werden";
        setTimeout(() => (this.setCard = ""), 2000);
      } finally {
        try {
          setTimeout(async () => (this.cards = await API.getCards()), 1000);
        } catch (e) {
          console.log({ error: e });
        }
      }
    },
    editCard(card: idCard) {
      this.editingCard = true;
      this.name = card.name;
      this.description = card.description;
      this.manacost = card.manacost;
      this.type = card.type;
      this.discardAfterUser = card.discardAfterUser;
      this.hp = card.hp;
      this.armor = card.armor;
      this.movement = card.movement;
      this.range = card.range;
      this.tp = card.tp;
      this.id = card.id;
    },
    async deleteCard(card: idCard) {
      console.log(card.id);
      if (window.confirm(`Sicher das du "${card.name}" löschen möchtest ? `))
        try {
          await API.deleteCard(card.id);
        } catch (e) {
          console.log({ error: e });
        } finally {
          try {
            setTimeout(async () => (this.cards = await API.getCards()), 1000);
          } catch (e) {
            console.log({ error: e });
          }
        }
    },
    clearInputs() {
      this.editingCard = false;
      this.name = "";
      this.description = "";
      this.manacost = 0;
      this.type = "" as "unit" | "strategy" | "nebula" | "equipment" | "event";
      this.discardAfterUser = false;
      this.hp = 0;
      this.armor = 0;
      this.movement = 0;
      this.range = 0;
      this.tp = 0;
      this.id = "";
    },
  },
});
</script>
<style lang="scss"></style>
