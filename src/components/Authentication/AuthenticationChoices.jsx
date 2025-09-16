import { useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import EmailForm from "./EmailForm";

export default function AuthenticationChoices({ setUser, setLoading, setOpen, emailFormMethod, googleMethod, submitText }) {
  const [choice, setChoice] = useState(null);

  return (
    <>
      {!choice && (
        <>
          <h1 className="cartoon-text text-2xl">{submitText} with:</h1>
          <button
            onClick={() => {
              setChoice("email");
            }}
            className="main-button click-buttons cartoon-text"
          >
            Email
          </button>
          <button onClick={() => googleMethod()} className="main-button click-buttons cartoon-text">
            Google
          </button>
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
      )}
      {choice === "email" && <EmailForm setLoading={setLoading} setUser={setUser} emailFormMethod={emailFormMethod} submitText={submitText} setOpen={setChoice} />}
    </>
  );
}
