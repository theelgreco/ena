"use client";
import { useState } from "react";

import { GameMediator } from "@/objects/game";
import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField } from "@mui/material";
import { signUserOut } from "@/firebase/authentication";

import Logo from "../Logo/Logo";
import PlayerAvatar from "../PlayerAvatar/PlayerAvatar";
import CapacityPopup from "../CapacityPopup/CapacityPopup";

export default function HomeScreen({ game, setGame, setPlayer, setMediator, setStateManager, user, setUser }) {
  const [disableButtons, setDisableButtons] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const [capacityPopupOpen, setCapacityPopupOpen] = useState(false);

  async function handleStartGame(capacity) {
    if (!game && user.displayName) {
      setDisableButtons(true);
      try {
        const mediator = new GameMediator(setMediator);
        mediator.createGame(capacity, user.displayName, user.photoURL, setPlayer, setGame, setStateManager);
      } catch (error) {
        console.error(error);
      } finally {
        setDisableButtons(false);
      }
    }
  }

  async function handleJoinGame(code) {
    if (!game && user.displayName) {
      setDisableButtons(true);

      try {
        const mediator = new GameMediator(setMediator);
        mediator.joinGame(user.displayName, user.photoURL, code, setPlayer, setGame, setStateManager);
      } catch (error) {
        console.error(error);
      } finally {
        setDisableButtons(false);
      }
    }
  }

  function handleModalOpen() {
    setModalOpen(true);
  }

  function handleModalClose() {
    setModalOpen(false);
  }

  function handleCapacityClose(value) {
    if (value) {
      handleStartGame(value);
    } else {
      setCapacityPopupOpen(false);
    }
  }

  return (
    <>
      <section className="w-full h-full dropped-section">
        <div className="flex flex-col gap-4 w-full h-full flex-nowrap justify-start items-center">
          <div className="logo-container">
            <Logo />
          </div>
          <div className="buttons-container flex flex-col gap-4 w-full h-full flex-nowrap justify-start items-center scrollbar-none overflow-y-auto">
            <PlayerAvatar username={user.displayName} photoURL={user.photoURL} signedIn={true} />
            <button className="main-button click-buttons cartoon-text mt-5" onClick={handleModalOpen} disabled={disableButtons}>
              Join game
            </button>
            <button
              className="main-button click-buttons cartoon-text"
              onClick={() => {
                setCapacityPopupOpen(true);
              }}
              disabled={disableButtons}
            >
              Create game
            </button>
            <button
              onClick={async () => {
                await signUserOut(setUser);
              }}
              className="leave-button cartoon-text"
            >
              Sign out
            </button>
          </div>

          <Dialog
            open={modalOpen}
            onClose={handleModalClose}
            PaperProps={{
              component: "form",
              onSubmit: async (event) => {
                event.preventDefault();
                const formData = new FormData(event.currentTarget);
                const formJson = Object.fromEntries(formData.entries());
                const gameCode = formJson.code;

                await handleJoinGame(gameCode);

                handleModalClose();
              },
            }}
          >
            <DialogTitle>Join game</DialogTitle>
            <DialogContent>
              <DialogContentText>To join a game, please enter a valid game code.</DialogContentText>
              <TextField autoFocus required margin="dense" id="code" name="code" label="Game code" type="number" fullWidth variant="standard" />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleModalClose}>Cancel</Button>
              <Button type="submit">Join</Button>
            </DialogActions>
          </Dialog>
          <CapacityPopup onClose={handleCapacityClose} selectedValue={null} open={capacityPopupOpen} />
        </div>
      </section>
    </>
  );
}
