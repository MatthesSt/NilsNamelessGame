import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import { getAuth, User } from "@firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { ref } from "vue";

import Login from "../views/Login.vue";
import Main from "../views/Main.vue";
import DeckEditor from "../views/DeckEditor.vue";
import LayoutEditor from "../views/LayoutEditor.vue";
import CardEditor from "../views/CardEditor.vue";
import Game from "../views/Game.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Login",
    component: Login,
  },
  {
    path: "/Main",
    name: "Main",
    component: Main,
  },
  {
    path: "/DeckEditor",
    name: "DeckEditor",
    component: DeckEditor,
  },
  {
    path: "/LayoutEditor",
    name: "LayoutEditor",
    component: LayoutEditor,
  },
  {
    path: "/CardEditor",
    name: "CardEditor",
    component: CardEditor,
  },
  {
    path: "/Game",
    name: "Game",
    component: Game,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export const currentUser = ref<User | null>(null);

const getCurrentUser = () => {
  const auth = getAuth();
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(
      auth,
      user => {
        currentUser.value = user;
        unsubscribe();
        resolve(user);
      },
      reject
    );
  });
};

export default router;
