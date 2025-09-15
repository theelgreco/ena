import { app } from "./firebase";
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
  signInWithRedirect,
  getRedirectResult,
  connectAuthEmulator,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { usersCollection } from "./db";
import { getAllIcons } from "./storage";
import { generate } from "random-words";

export const auth = process.env.NODE_ENV === "production" ? getAuth(app) : getAuth();

if (process.env.NODE_ENV !== "production") {
  connectAuthEmulator(auth, "http://127.0.0.1:9099");
}

setPersistence(auth, browserLocalPersistence);

export const attemptSignInFromLocal = (setUser) => {
  const userLocalStorageKey = `firebase:authUser:${app.options.apiKey}:${app.name}`;
  const userFromLocalStorage = localStorage.getItem(userLocalStorageKey);
  if (userLocalStorageKey) {
    setUser(JSON.parse(userFromLocalStorage));
  }
};

const generateRandomDetails = async (user) => {
  const username = generate({ exactly: 2, maxLength: 4, join: "-" });
  const icons = await getAllIcons();
  const randomIcon = icons[Math.floor(Math.random() * icons.length)];

  await updateProfile(user, { displayName: username, photoURL: randomIcon });
};

export const signInAsGuest = async (setUser, setLoading) => {
  try {
    setLoading(true);
    const data = await signInAnonymously(auth);
    const user = data.user;
    await generateRandomDetails(user);
    setUser(user);
  } catch (error) {
    const errorMessage = error.message;
    console.error(errorMessage);
  } finally {
    setLoading(false);
  }
};

export const handleEmailSignIn = async (email, password, setUser, setLoading) => {
  if (email && password) {
    try {
      setLoading(true);
      const data = await signInWithEmailAndPassword(auth, email, password);
      const user = data.user;
      setUser(user);
    } catch (error) {
      const errorMessage = error.message;
      console.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }
};

export const handleEmailSignUp = async (email, password, setUser, setLoading) => {
  if (email && password) {
    try {
      setLoading(true);

      const data = await createUserWithEmailAndPassword(auth, email, password);
      const user = data.user;

      await generateRandomDetails(user);

      const userDocRef = doc(usersCollection, user.email);

      await setDoc(userDocRef, { username: user.displayName, photoURL: user.photoURL, email: user.email });

      setUser(user);
    } catch (error) {
      const errorMessage = error.message;
      console.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }
};

export const signInAfterRedirect = async (setUser, setLoading) => {
  try {
    setLoading(true);
    const result = await getRedirectResult(auth);

    if (result) {
      const user = result.user;
      const userDocRef = doc(usersCollection, result.user.email);

      const userDoc = await getDoc(userDocRef);
      const userExists = await checkIfUserExists(userDoc);

      if (!userExists) {
        await generateRandomDetails(user);
        await setDoc(userDocRef, { username: user.displayName, photoURL: user.photoURL, email: user.email });
      }

      setUser(user);
    }
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};

export const checkIfUserExists = async (user) => {
  try {
    return user.exists();
  } catch (error) {
    console.error(error);
  }
};

export const signUserOut = async (setUser) => {
  try {
    await signOut(auth);
    setUser(null);
  } catch (error) {
    console.error("Error occurred while attempting to sign you out: ", console.error(error));
  }
};

export const handleGoogleSignIn = async (setUser) => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    const user = result.user;
    setUser(user);
  } catch (error) {
    const errorMessage = error.message;
    console.error("Error while signing in with Google: ", errorMessage);
  }
};

export const handleGoogleSignUp = async (setUser) => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    const user = result.user;
    await generateRandomDetails(user);
    setUser(user);
  } catch (error) {
    const errorMessage = error.message;
    console.error("Error while signing in with Google: ", errorMessage);
  }
};
