import { createRouter, createWebHashHistory, createWebHistory, RouteRecordRaw } from "vue-router";
import { getAuth, User } from "@firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { ref } from "vue";
import * as API from "../../API";

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
    meta: { requiresAuth: true },
  },
  {
    path: "/DeckEditor",
    name: "DeckEditor",
    component: DeckEditor,
    meta: { requiresAuth: true },
  },
  {
    path: "/LayoutEditor",
    name: "LayoutEditor",
    component: LayoutEditor,
    meta: { requiresAuth: true },
  },
  {
    path: "/CardEditor",
    name: "CardEditor",
    component: CardEditor,
    meta: { requiresAuth: true },
  },
  {
    path: "/Game",
    name: "Game",
    component: Game,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory("/NilsNamelessGame/"),
  routes,
});

export const currentUser = ref<(User & { username: string }) | null>(null);

const getCurrentUser = () => {
  const auth = getAuth();
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async user => {
        if (!currentUser.value) currentUser.value = user as any;
        currentUser.value = user && { ...user, username: await API.getUsername() };
        unsubscribe();
        resolve(currentUser.value);
      },
      reject
    );
  });
};

router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  if (!(await getCurrentUser()) && requiresAuth) {
    next("/");
  } else {
    next();
  }
});

export default router;
