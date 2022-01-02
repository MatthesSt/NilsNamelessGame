import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import { getAuth, User } from '@firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { ref } from 'vue';

import Home from '../views/Home.vue';
import Login from '../views/Home.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
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
