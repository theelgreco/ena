"use client";
import { useState, useEffect } from "react";

export default function GameRoom({ username, game }) {
  const [selectedCards, setSelectedCards] = useState([]);

  useEffect(() => {
    console.log(selectedCards);
  }, [selectedCards]);

  function handleCardClick(e) {
    // const selectedCardsCopy = [...selectedCards];
    // const indexOfSelection = Number(e.target.id);
    // selectedCardsCopy.push(game.getPlayerHand(username)[indexOfSelection]);
  }

  return (
    <section className="w-full h-[100svh]">
      <div className="flex flex-row flex-nowrap w-full max-w-full h-full max-h-full justify-center">
        <div className="flex flex-col flex-nowrap min-w-[30%] flex-grow"></div>
        <div className="flex flex-col flex-nowrap min-w-[30%] flex-grow">
          <div className="flex flex-row flex-nowrap min-h-[30%] flex-grow w-full max-w-full"></div>
          <div className="flex flex-row flex-nowrap min-h-[30% flex-grow w-full max-w-full"></div>
          <div className="flex flex-row flex-nowrap min-h-[30%] flex-grow w-full max-w-full justify-center">
            {game.getPlayerHand(username).map((card, index) => {
              return (
                <img
                  key={`${username}_${card.colour}-${card.value}_${index}.${
                    Math.random() * 10000
                  }`}
                  id={index}
                  className="h-[80px]"
                  src={card.imagePath}
                  onClick={handleCardClick}
                />
              );
            })}
          </div>
        </div>
        <div className="flex flex-col flex-nowrap min-w-[30%] flex-grow"></div>
      </div>
    </section>
  );
}
