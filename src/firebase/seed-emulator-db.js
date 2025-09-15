import { v4 as uuidv4 } from "uuid";

export default function seedDB() {
  const colours = ["blue", "yellow", "red", "green"];
  const values = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "switch", "skip", "+2"];
  const deck = [];

  const leftStr = "http://127.0.0.1:9199/v0/b/ena-game-6b545.appspot.com/o/cards%2F";
  const rightStr = ".svg?alt=media&token=d48d504b-99fa-4842-be5b-919df43efde7";

  for (let j = 0; j < colours.length; j++) {
    const colour = colours[j];

    for (let i = 0; i < values.length; i++) {
      const value = values[i];
      const middleStr = decodeURIComponent(`${colour}-${value}`);

      if (value === "0") {
        deck.push({ id: uuidv4(), colour, value, imagePath: `${leftStr}${middleStr}${rightStr}` });
      } else {
        deck.push({ id: uuidv4(), colour, value, imagePath: `${leftStr}${middleStr}${rightStr}` });
        deck.push({ id: uuidv4(), colour, value, imagePath: `${leftStr}${middleStr}${rightStr}` });
      }
    }
  }

  deck.push({ id: uuidv4(), colour: "black", value: "+4", imagePath: `${leftStr}${decodeURIComponent("black-+4")}${rightStr}` });
  deck.push({ id: uuidv4(), colour: "black", value: "+4", imagePath: `${leftStr}${decodeURIComponent("black-+4")}${rightStr}` });
  deck.push({ id: uuidv4(), colour: "black", value: "+4", imagePath: `${leftStr}${decodeURIComponent("black-+4")}${rightStr}` });
  deck.push({ id: uuidv4(), colour: "black", value: "+4", imagePath: `${leftStr}${decodeURIComponent("black-+4")}${rightStr}` });

  deck.push({ id: uuidv4(), colour: "black", value: "wild", imagePath: `${leftStr}black-wild${rightStr}` });
  deck.push({ id: uuidv4(), colour: "black", value: "wild", imagePath: `${leftStr}black-wild${rightStr}` });
  deck.push({ id: uuidv4(), colour: "black", value: "wild", imagePath: `${leftStr}black-wild${rightStr}` });
  deck.push({ id: uuidv4(), colour: "black", value: "wild", imagePath: `${leftStr}black-wild${rightStr}` });

  return { cards: deck, count: deck.length };
}
