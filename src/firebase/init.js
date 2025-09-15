import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyA_xeqf9jhLwJ_vZWJ1DaflVcA99wtgb14",
  authDomain: "ena-game-6b545.firebaseapp.com",
  databaseURL: "https://ena-game-6b545-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "ena-game-6b545",
  storageBucket: "ena-game-6b545.appspot.com",
  messagingSenderId: "939065635505",
  appId: "1:939065635505:web:1804e650c966dc63c0e890",
};

export const app = initializeApp(firebaseConfig);
