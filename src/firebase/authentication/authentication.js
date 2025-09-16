import { app } from "../init";
import {
  getAuth,
  browserLocalPersistence,
  setPersistence,
  signInAnonymously,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  connectAuthEmulator,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { usersCollection } from "../firestore/collections";
import { getAllIcons } from "../storage/storage";
import { generate } from "random-words";

const auth = process.env.NODE_ENV === "production" ? getAuth(app) : getAuth();

if (process.env.NODE_ENV !== "production") {
  connectAuthEmulator(auth, "http://127.0.0.1:9099");
}

setPersistence(auth, browserLocalPersistence);

const generateRandomDetails = async (user) => {
  const username = generate({ exactly: 2, maxLength: 4, join: "-" });
  const icons = await getAllIcons();
  const randomIcon = icons[Math.floor(Math.random() * icons.length)];

  await updateProfile(user, { displayName: username, photoURL: randomIcon });
};

export const localStorageUserKey = `firebase:authUser:${app.options.apiKey}:${app.name}`;

export async function checkIfUserExists(user) {
  return user.exists();
}

export async function signInAsGuest() {
  const data = await signInAnonymously(auth);
  const user = data.user;
  await generateRandomDetails(user);

  return user.toJSON();
}

export async function signInWithEmail(email, password) {
  if (email && password) {
    const data = await signInWithEmailAndPassword(auth, email, password);
    return data.user;
  }
}

export async function signUpWithEmail(email, password) {
  if (email && password) {
    const data = await createUserWithEmailAndPassword(auth, email, password);
    const user = data.user;

    await generateRandomDetails(user);

    const userDocRef = doc(usersCollection, user.email);

    await setDoc(userDocRef, { username: user.displayName, photoURL: user.photoURL, email: user.email });

    return user.toJSON();
  }
}

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  const credential = GoogleAuthProvider.credentialFromResult(result);
  const token = credential.accessToken;
  return result.user.toJSON();
}

export async function signUpWithGoogle() {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  const credential = GoogleAuthProvider.credentialFromResult(result);
  const token = credential.accessToken;
  const user = result.user;
  await generateRandomDetails(user);
  return user.toJSON();
}

export async function signUserOut() {
  await signOut(auth);
}
