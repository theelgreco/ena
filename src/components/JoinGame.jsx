"use client";
import { GameMediator } from "@/objects/game";
import { useState } from "react";

import Logo from "./Logo";

import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField } from "@mui/material";

export default function JoinGame({ game, setGame, setPlayer, setMediator, setStateManager }) {
  const [username, setUsername] = useState(null);
  const [disableButtons, setDisableButtons] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  async function handleStartGame() {
    if (!game && username) {
      setDisableButtons(true);
      try {
        const mediator = new GameMediator(setMediator);
        mediator.createGame(username, setPlayer, setGame, setStateManager);
      } catch (error) {
        console.error(error);
      } finally {
        setDisableButtons(false);
      }
    }
  }

  async function handleJoinGame(code) {
    if (!game && username) {
      setDisableButtons(true);

      try {
        const mediator = new GameMediator(setMediator);
        mediator.joinGame(username, code, setPlayer, setGame, setStateManager);
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

  function handleUsernameInput(e) {
    setUsername(e.target.value);
  }

  return (
    <>
      <section className="w-full h-full dropped-section">
        <div className="flex flex-col gap-4 w-full h-full flex-nowrap justify-start items-center">
          <div className="logo-container">
            <Logo />
          </div>
          <div className="buttons-container flex flex-col gap-4 w-full h-full flex-nowrap justify-start items-center scrollbar-none overflow-y-auto">
            <input type="text" placeholder="Name" className="p-3 text-3xl rounded-md mb-3" onChange={handleUsernameInput}></input>
            <button className="main-button click-buttons cartoon-text" onClick={handleModalOpen} disabled={disableButtons}>
              Join game
            </button>
            <button className="main-button click-buttons cartoon-text" onClick={handleStartGame} disabled={disableButtons}>
              Create game
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
        </div>
      </section>
    </>
  );
}
