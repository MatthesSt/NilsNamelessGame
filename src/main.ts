import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';

// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCEDGwSqcQYhWn8xMMo0X72NmL7JqMjaXg',
  authDomain: 'nilsnamelessgame.firebaseapp.com',
  projectId: 'nilsnamelessgame',
  storageBucket: 'nilsnamelessgame.appspot.com',
  messagingSenderId: '282317309357',
  appId: '1:282317309357:web:ecf01dbc6245502dae8d24',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

createApp(App).use(router).mount('#app');
