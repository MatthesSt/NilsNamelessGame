<template>
  <div class="container">
    <div class="card mx-auto m-5" id="CreateCard">
      <div class="card-header" v-if="!editingCard">create new Card</div>
      <div class="card-header" v-if="editingCard">edit Card</div>
      <div class="card-body">
        <div v-if="setCard" :class="feedbackState">{{ setCard }}</div>
        <form @submit.prevent="createCard()" class="m-5 mt-4">
          <div class="row ps-5">
            <input class="col-6" type="text" placeholder="cardname" v-model="name" required />
            <input class="col-6" type="text" placeholder="description" v-model="description" required />
          </div>
          <div class="row mt-4 ps-1">
            <div class="col-6">
              <label for="type" class="me-2">Card type:</label>
              <select name="type" required v-model="cardType">
                <option v-for="type in cardTypes" :key="type" :value="type">{{ type }}</option>
              </select>
            </div>
            <div class="col-6">
              <label for="discard" class="me-2">single use ?</label>
              <select name="discard" v-model="discardAfterUser" required>
                <option value="true">discard after use</option>
                <option value="false">keep</option>
              </select>
            </div>
          </div>
          <!-- stats -->
          <div class="row mt-4 ps-1">
            <div class="col-4">
              <label for="mana" class="me-2">manacost:</label>
              <input name="mana" type="number" placeholder="manacost" v-model="manacost" max="10" min="0" required />
            </div>
            <div class="col-4">
              <label for="hp" class="me-2">hp:</label>
              <input name="hp" placeholder="hp" type="number" required v-model="hp" max="50" min="0" />
            </div>
            <div class="col-4">
              <label for="armor" class="me-2">armor:</label>
              <input name="armor" placeholder="armor" type="number" required v-model="armor" max="50" min="0" />
            </div>
            <div class="col-4">
              <label for="movement" class="me-2">movement:</label>
              <input name="movement" placeholder="movement" type="number" required v-model="movement" max="10" min="0" />
            </div>

            <div class="col-4">
              <label for="range" class="me-2">range:</label>
              <input name="range" placeholder="range" type="number" required v-model="range" max="10" min="0" />
            </div>
            <div class="col-4">
              <label for="tp" class="me-2">tp:</label>
              <input name="tp" placeholder="tp" type="number" required v-model="tp" max="50" min="0" />
            </div>
          </div>
          <!-- stats end -->
          <div class="row mt-4 ps-1">
            <!-- effects -->
            <div class="col-12 row mb-3">
              <div class="col-3">
                <label for="effecttype" class="me-2">effect type:</label>
                <select name="effecttype" required v-model="effect.type">
                  <option v-for="type in effectTypes" :key="type" :value="type">{{ type }}</option>
                </select>
              </div>
              <div class="col-6">
                <label for="effectamount" class="me-2">effect amount:</label>
                <input name="effectamount" type="number" required v-model="effect.amount" />
              </div>
              <div class="col-3">
                <label for="effectstat" class="me-2">effect stat:</label>
                <select name="effectstat" required v-model="effect.stat">
                  <option v-for="stat in effectStats" :key="stat" :value="stat">{{ stat }}</option>
                </select>
              </div>
            </div>
            <!-- effects end -->
            <!-- side buffs -->
            <!-- up -->
            <div class="row">
              <div class="col">
                <label for="up" class="me-2">up type:</label>
                <select name="up" v-model="up.type">
                  <option v-for="type in sideBuffTypes" :key="type" :value="type">{{ type }}</option>
                </select>
              </div>
              <div class="col">
                <label for="upStat">stat:</label>
                <select name="upStat" v-model="up.stat">
                  <option v-for="stat in sideBuffStats" :key="stat" :value="stat">{{ stat }}</option>
                </select>
              </div>
              <div class="col">
                <label for="upTrait">trait:</label>
                <select name="upTrait" v-model="up.trait">
                  <option v-for="trait in sideBuffTraits" :key="trait" :value="trait">{{ trait }}</option>
                </select>
              </div>
              <div class="col">
                <label for="upAmount">amount:</label>
                <input name="upAmount" type="number" v-model="up.amount" />
              </div>
            </div>
            <!-- left -->
            <div class="row">
              <div class="col">
                <label for="left" class="me-2">left type:</label>
                <select name="left" v-model="left.type">
                  <option v-for="type in sideBuffTypes" :key="type" :value="type">{{ type }}</option>
                </select>
              </div>
              <div class="col">
                <label for="leftStat">stat:</label>
                <select name="leftStat" v-model="left.stat">
                  <option v-for="stat in sideBuffStats" :key="stat" :value="stat">{{ stat }}</option>
                </select>
              </div>
              <div class="col">
                <label for="leftTrait">trait:</label>
                <select name="leftTrait" v-model="left.trait">
                  <option v-for="trait in sideBuffTraits" :key="trait" :value="trait">{{ trait }}</option>
                </select>
              </div>
              <div class="col">
                <label for="leftAmount">amount:</label>
                <input name="leftAmount" type="number" v-model="left.amount" />
              </div>
            </div>
            <!-- right -->
            <div class="row">
              <div class="col">
                <label for="right" class="me-2">right type:</label>
                <select name="right" v-model="right.type">
                  <option v-for="type in sideBuffTypes" :key="type" :value="type">{{ type }}</option>
                </select>
              </div>
              <div class="col">
                <label for="rightStat">stat:</label>
                <select name="rightStat" v-model="right.stat">
                  <option v-for="stat in sideBuffStats" :key="stat" :value="stat">{{ stat }}</option>
                </select>
              </div>
              <div class="col">
                <label for="rightTrait">trait:</label>
                <select name="rightTrait" v-model="right.trait">
                  <option v-for="trait in sideBuffTraits" :key="trait" :value="trait">{{ trait }}</option>
                </select>
              </div>
              <div class="col">
                <label for="rightAmount">amount:</label>
                <input name="rightAmount" type="number" v-model="right.amount" />
              </div>
            </div>
            <!-- down -->
            <div class="row">
              <div class="col">
                <label for="down" class="me-2">down type:</label>
                <select name="down" v-model="down.type">
                  <option v-for="type in sideBuffTypes" :key="type" :value="type">{{ type }}</option>
                </select>
              </div>
              <div class="col">
                <label for="downStat">stat:</label>
                <select name="downStat" v-model="down.stat">
                  <option v-for="stat in sideBuffStats" :key="stat" :value="stat">{{ stat }}</option>
                </select>
              </div>
              <div class="col">
                <label for="downTrait">trait:</label>
                <select name="downTrait" v-model="down.trait">
                  <option v-for="trait in sideBuffTraits" :key="trait" :value="trait">{{ trait }}</option>
                </select>
              </div>
              <div class="col">
                <label for="downAmount">amount:</label>
                <input name="downAmount" type="number" v-model="down.amount" />
              </div>
            </div>
            <!-- sidebuffs end -->
          </div>
          <button type="submit" class="btn btn-success mt-4" v-if="!editingCard">create Card</button>
          <button type="submit" class="btn btn-success mt-4" v-if="editingCard">save changes</button>
        </form>
      </div>
    </div>
    <!-- display cards -->
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
              <div>effect: {{ card.effect }} | up: {{ card.up }} | left: {{ card.left }} | right: {{ card.right }} | down: {{ card.down }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- display end -->
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import * as API from "../../API";

export default defineComponent({
  data() {
    return {
      effectTypes: ["buff", "heal", "dmg"],
      effectAmunt: 0,
      effectStats: ["HP", "TP", "A", "R", "M"],

      cardTypes: ["unit", "strategy", "nebula", "equipment", "event"],

      directions: ["up", "left", "right", "down"],

      sideBuffTypes: ["trait", "stat"],
      sideBuffTraits: ["priest", "test1", "test2"],
      sideBuffStats: ["HP", "TP", "A", "R", "M"],
      sideBuffAmount: 0,

      name: "",
      description: "",
      manacost: 0,
      cardType: "" as "unit" | "strategy" | "nebula" | "equipment" | "event",
      discardAfterUse: false,
      hp: 0,
      armor: 0,
      movement: 0,
      range: 0,
      tp: 0,
      effect: {} as API.effect,
      up: {} as API.sideBuff,
      left: {} as API.sideBuff,
      right: {} as API.sideBuff,
      down: {} as API.sideBuff,
      id: "",

      cards: [] as API.idCard[],

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
        type: this.cardType,
        discardAfterUse: this.discardAfterUse,
        hp: this.hp,
        armor: this.armor,
        movement: this.movement,
        range: this.range,
        tp: this.tp,
        effect: this.effect,
        up: this.up,
        left: this.left,
        right: this.right,
        down: this.down,
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
    editCard(card: API.idCard) {
      this.editingCard = true;
      this.name = card.name;
      this.description = card.description;
      this.manacost = card.manacost;
      this.cardType = card.type;
      this.discardAfterUse = card.discardAfterUse;
      this.hp = card.hp;
      this.armor = card.armor;
      this.movement = card.movement;
      this.range = card.range;
      this.tp = card.tp;
      this.id = card.id;
      this.effect = card.effect;
      this.up = card.up;
      this.left = card.left;
      this.right = card.right;
      this.down = card.down;
    },
    async deleteCard(card: API.idCard) {
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
      this.cardType = "" as "unit" | "strategy" | "nebula" | "equipment" | "event";
      this.discardAfterUse = false;
      this.hp = 0;
      this.armor = 0;
      this.movement = 0;
      this.range = 0;
      this.tp = 0;
      this.id = "";
      this.effect = {} as API.effect;
      this.up = {} as API.sideBuff;
      this.left = {} as API.sideBuff;
      this.right = {} as API.sideBuff;
      this.down = {} as API.sideBuff;
    },
  },
});
</script>
<style lang="scss"></style>
