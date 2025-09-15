import { Dialog, DialogTitle, List, ListItem, ListItemButton, ListItemText } from "@mui/material";

export default function CapacityPopup({ onClose, selectedValue, open }) {
  const handleClose = () => {
    onClose(selectedValue);
  };

  const handleListItemClick = (value) => {
    onClose(value);
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle className="bg-red-600 text-slate-200 cartoon-text">How many players do you want?</DialogTitle>
      <List sx={{ pt: 0 }} className="bg-red-600 flex flex-row flex-wrap justify-evenly" style={{ width: "350px", maxWidth: "100%" }}>
        <ListItem style={{ width: "42%", aspectRatio: 1, minWidth: "100px" }} className="rounded-xl hover:border-[3px] hover:bg-black hover:bg-opacity-30 hover:border-yellow-300 m-3">
          <ListItemButton onClick={() => handleListItemClick(2)} disableRipple style={{ background: "transparent", width: "100%", height: "100%", color: "white !important" }} className="rounded-xl">
            <p className="cartoon-text mx-auto text-white text-8xl">2</p>
          </ListItemButton>
        </ListItem>
        <ListItem style={{ width: "42%", aspectRatio: 1, minWidth: "100px" }} className="rounded-xl hover:border-[3px] hover:bg-black hover:bg-opacity-30 hover:border-yellow-300 m-3">
          <ListItemButton onClick={() => handleListItemClick(3)} disableRipple style={{ background: "transparent", width: "100%", height: "100%", color: "white !important" }} className="rounded-xl">
            <p className="cartoon-text mx-auto text-white text-8xl">3</p>
          </ListItemButton>
        </ListItem>
        <ListItem style={{ width: "42%", aspectRatio: 1, minWidth: "100px" }} className="rounded-xl hover:border-[3px] hover:bg-black hover:bg-opacity-30 hover:border-yellow-300 m-3">
          <ListItemButton onClick={() => handleListItemClick(4)} disableRipple style={{ background: "transparent", width: "100%", height: "100%", color: "white !important" }} className="rounded-xl">
            <p className="cartoon-text mx-auto text-white text-8xl">4</p>
          </ListItemButton>
        </ListItem>
        <ListItem style={{ width: "42%", aspectRatio: 1, minWidth: "100px" }} className="rounded-xl hover:border-[3px] hover:bg-black hover:bg-opacity-30 hover:border-yellow-300 m-3">
          <ListItemButton onClick={() => handleListItemClick(5)} disableRipple style={{ background: "transparent", width: "100%", height: "100%", color: "white !important" }} className="rounded-xl">
            <p className="cartoon-text mx-auto text-white text-8xl">5</p>
          </ListItemButton>
        </ListItem>
      </List>
    </Dialog>
  );
}
