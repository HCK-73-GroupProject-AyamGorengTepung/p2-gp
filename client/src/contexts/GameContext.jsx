import React, { createContext, useState, useContext } from "react";

const GameContext = createContext();

export const useGameContext = () => useContext(GameContext);

export const GameProvider = ({ children }) => {
  const [roomId, setRoomId] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);

  return (
    <GameContext.Provider
      value={{ roomId, setRoomId, gameStarted, setGameStarted }}
    >
      {children}
    </GameContext.Provider>
  );
};
