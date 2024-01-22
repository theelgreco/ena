"use client";
import { Game, Player, GameMediator } from "@/objects/game";
import { useState, useEffect } from "react";

import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField } from "@mui/material";

export default function JoinGame({ game, setGame, setPlayer, setMediator }) {
  const [username, setUsername] = useState(null);
  const [disableButtons, setDisableButtons] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  async function handleStartGame() {
    if (!game && username) {
      setDisableButtons(true);
      try {
        const mediator = new GameMediator(setMediator);
        mediator.createGame(username, setPlayer, setGame);
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
        mediator.joinGame(username, code, setPlayer, setGame);
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
    <section className="sm:w-[35%] w-full max-w-sm">
      <div className="flex flex-col gap-4 w-full flex-wrap justify-center">
        <input type="text" placeholder="Name" className="p-3 text-3xl rounded-md flex-grow w-full" onChange={handleUsernameInput}></input>
        <div className="flex flex-row flex-wrap gap-6">
          <Button variant="contained" className="bg-blue-500 text-white font-bold py-4 px-8 rounded flex-grow max-w-full" onClick={handleModalOpen} disabled={disableButtons}>
            Join a game
          </Button>
          <Button variant="contained" className="bg-blue-500 text-white font-bold py-4 px-8 rounded flex-grow max-w-full" onClick={handleStartGame} disabled={disableButtons}>
            Start a game
          </Button>

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
      </div>
    </section>
  );
}
