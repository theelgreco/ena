import { app } from "./firebase";
import { getFirestore, collection, connectFirestoreEmulator, doc, getDoc, setDoc } from "firebase/firestore";
import seedDB from "./seed-emulator-db";

let db;

if (process.env.NODE_ENV !== "production") {
  db = getFirestore();
  connectFirestoreEmulator(db, "127.0.0.1", 8080);
} else {
  db = getFirestore(app);
}

export const gamesCollection = collection(db, "games");
export const metaCollection = collection(db, "meta");
export const usersCollection = collection(db, "users");

async function handleDBPopulation() {
  const deckDoc = doc(metaCollection, "deck");
  const deck = (await getDoc(deckDoc)).data();

  if (!deck) {
    setDoc(deckDoc, seedDB());
  }
}

handleDBPopulation();

export default db;
