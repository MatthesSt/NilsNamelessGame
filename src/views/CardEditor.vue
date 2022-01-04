<template>
  <div class="container">
    <div class="card mx-auto m-5">
      <div class="card-header">create new Card</div>
      <div class="card-body">
        <form>
          <input type="text" placeholder="cardname" v-model="name" required />
          <input type="text" placeholder="description" v-model="description" required />
          <input type="number" placeholder="manacost" v-model="manacost" max="10" min="0" required />
          <select placeholder="type" v-model="type" required>
            <option value="unit">Einheit</option>
            <option value="strategy">Strategiekarte</option>
            <option value="nebula">Nebel</option>
            <option value="equipment">Ausrüstung</option>
            <option value="event">Event</option>
          </select>
          <select v-model="discardAfterUser" required>
            <option value="true">discard after use</option>
            <option value="false">keep</option>
          </select>
          <label for="hp">hp:</label>
          <input name="hp" placeholder="hp" type="number" required v-model="hp" max="10" min="0" />
          <label for="armor">armor:</label>
          <input name="armor" placeholder="armor" type="number" required v-model="armor" max="10" min="0" />
          <label for="movement">movement:</label>
          <input name="movement" placeholder="movement" type="number" required v-model="movement" max="10" min="0" />
          <label for="range">range:</label>
          <input name="range" placeholder="range" type="number" required v-model="range" max="10" min="0" />
          <label for="tp">tp:</label>
          <input name="tp" placeholder="tp" type="number" required v-model="tp" max="10" min="0" />
        </form>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  data() {
    return {
      name: "",
      discription: "",
      manacost: "",
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
    };
  },
});
</script>
<style lang="scss"></style>
