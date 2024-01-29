import { Dialog, DialogTitle, List, ListItem, ListItemButton } from "@mui/material";

const colours = [
  {
    name: "blue",
    value: "#1060d4",
  },
  {
    name: "yellow",
    value: "#ffe61e",
  },
  {
    name: "red",
    value: "#ff0000",
  },
  {
    name: "green",
    value: "#499a16",
  },
];

export default function ColourPopup({ onClose, selectedValue, open }) {
  const handleClose = () => {
    onClose(selectedValue);
  };

  const handleListItemClick = (value) => {
    onClose(value);
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle className="bg-slate-600 text-slate-200">Choose colour</DialogTitle>
      <List sx={{ pt: 0 }} className="bg-slate-600 flex flex-row flex-wrap justify-evenly" style={{ width: "350px", maxWidth: "100%" }}>
        {colours.map((colour) => (
          <ListItem disablePadding key={colour.name} style={{ width: "42%", aspectRatio: 1, minWidth: "100px" }} className="rounded-xl hover:border-[3px] hover:border-white m-3">
            <ListItemButton
              onClick={() => handleListItemClick(colour.name)}
              style={{ background: colour.value, width: "100%", height: "100%" }}
              className="rounded-xl hover:border-[3px] hover:border-white"
            />
          </ListItem>
        ))}
      </List>
    </Dialog>
  );
}
