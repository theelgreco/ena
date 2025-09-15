import { app } from "../init";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

let db;

if (process.env.NODE_ENV !== "production") {
  db = getFirestore();
  connectFirestoreEmulator(db, "127.0.0.1", 8080);
} else {
  db = getFirestore(app);
}

export default db;
