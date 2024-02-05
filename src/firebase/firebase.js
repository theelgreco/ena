// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: "AIzaSyA_xeqf9jhLwJ_vZWJ1DaflVcA99wtgb14",
  authDomain: "ena-game-6b545.firebaseapp.com",
  databaseURL: "https://ena-game-6b545-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "ena-game-6b545",
  storageBucket: "ena-game-6b545.appspot.com",
  messagingSenderId: "939065635505",
  appId: "1:939065635505:web:1804e650c966dc63c0e890",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
