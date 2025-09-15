import { useState, useEffect } from "react";

import AuthenticationChoices from "./AuthenticationChoices";

import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Logo from "../Logo/Logo";

import { signInAsGuest, handleEmailSignUp, handleEmailSignIn, handleGoogleSignIn, handleGoogleSignUp, signInAfterRedirect } from "@/firebase/authentication/authentication";

export default function Authentication({ setUser }) {
  const [choice, setChoice] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    signInAfterRedirect(setUser, setLoading);
  }, []);

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
            <button
              className="main-button click-buttons cartoon-text"
              onClick={async () => {
                await signInAsGuest(setUser, setLoading);
              }}
            >
              Play as guest
            </button>
          </>
        )}
        {choice === "signIn" && (
          <AuthenticationChoices setUser={setUser} setLoading={setLoading} setOpen={setChoice} emailFormMethod={handleEmailSignIn} googleMethod={handleGoogleSignIn} submitText={"Sign in"} />
        )}
        {choice === "signUp" && (
          <AuthenticationChoices setUser={setUser} setLoading={setLoading} setOpen={setChoice} emailFormMethod={handleEmailSignUp} googleMethod={handleGoogleSignUp} submitText={"Sign up"} />
        )}
        <Backdrop sx={{ color: "#fff", zIndex: 9999 }} open={loading}>
          <CircularProgress color="inherit" />
        </Backdrop>
      </div>
    </section>
  );
}
