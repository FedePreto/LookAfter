import React, { createContext, useState } from 'react';

export const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
  const [isAudioOn, setIsAudioOn] = useState(true); // Lo stato globale dell'audio

  const toggleAudio = () => setIsAudioOn((prev) => !prev); // Cambia lo stato on/off

  return (
    <AudioContext.Provider value={{ isAudioOn, toggleAudio }}>
      {children}
    </AudioContext.Provider>
  );
};
