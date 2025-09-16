import { useState, useEffect } from "react";

import AuthenticationChoices from "./AuthenticationChoices";

import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Logo from "../Logo/Logo";

import { signInAsGuest, signInWithEmail, signInWithGoogle, signUpWithEmail, signUpWithGoogle } from "@/firebase/authentication/authentication";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/errors";

export default function Authentication({ setUser }) {
  const [choice, setChoice] = useState(null);
  const [loading, setLoading] = useState(false);

  async function guestSignIn() {
    try {
      setLoading(true);
      const guestUser = await signInAsGuest();
      setUser(guestUser);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  async function emailSignIn(email, password) {
    try {
      setLoading(true);
      const user = await signInWithEmail(email, password);
      setUser(user);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  async function emailSignUp(email, password) {
    try {
      setLoading(true);
      const user = await signUpWithEmail(email, password);
      setUser(user);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  async function googleSignIn() {
    try {
      setLoading(true);
      const user = await signInWithGoogle();
      setUser(user);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  async function googleSignUp() {
    try {
      setLoading(true);
      const user = await signUpWithGoogle();
      setUser(user);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="w-full h-full dropped-section">
      <div className="flex flex-col gap-4 w-full h-full flex-nowrap justify-start items-center">
        <div className="logo-container">
          <Logo />
        </div>
        {!choice && (
          <>
            <button
              className="main-button click-buttons cartoon-text"
              onClick={() => {
                setChoice("signIn");
              }}
            >
              Sign in
            </button>
            <button
              className="main-button click-buttons cartoon-text"
              onClick={() => {
                setChoice("signUp");
              }}
            >
              Sign up
            </button>
            <button className="main-button click-buttons cartoon-text" onClick={guestSignIn}>
              Play as guest
            </button>
          </>
        )}
        {choice === "signIn" && (
          <AuthenticationChoices setUser={setUser} setLoading={setLoading} setOpen={setChoice} emailFormMethod={emailSignIn} googleMethod={googleSignIn} submitText={"Sign in"} />
        )}
        {choice === "signUp" && (
          <AuthenticationChoices setUser={setUser} setLoading={setLoading} setOpen={setChoice} emailFormMethod={emailSignUp} googleMethod={googleSignUp} submitText={"Sign up"} />
        )}
        <Backdrop sx={{ color: "#fff", zIndex: 9999 }} open={loading}>
          <CircularProgress color="inherit" />
        </Backdrop>
      </div>
    </section>
  );
}
