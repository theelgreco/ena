import { useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function EmailForm({ setLoading, setUser, emailFormMethod, submitText, setOpen }) {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);

  return (
    <>
      <form
        className="flex flex-col gap-6 items-center cartoon-text"
        id="signUpForm"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <div className="flex flex-col items-start">
          <label htmlFor="email" form="signUpForm">
            Email
          </label>
          <input
            className="main-input"
            type="email"
            id="email"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
        </div>
        <div className="flex flex-col items-start">
          <label htmlFor="password" form="signUpForm">
            Password
          </label>
          <input
            className="main-input"
            type="password"
            id="password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </div>
        <button onClick={emailFormMethod(email, password)} className="main-button click-buttons cartoon-text">
          {submitText}
        </button>
      </form>
      <button
        className="main-button self-start ml-6 p-2 px-4 cartoon-text rounded-md mt-auto mb-6"
        onClick={() => {
          setOpen(null);
        }}
      >
        <ArrowBackIcon sx={{ stroke: "#5d5431", strokeWidth: "0.75px", fontSize: "1.5em" }} />
        Back
      </button>
    </>
  );
}
