import db from "./db";
import { collection } from "firebase/firestore";

export const gamesCollection = collection(db, "games");

export const metaCollection = collection(db, "meta");

export const usersCollection = collection(db, "users");
