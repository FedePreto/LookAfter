import React, { createContext, useState } from 'react';

export const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
  const [isAudioOn, setIsAudioOn] = useState(false);
  const [activeScreen, setActiveScreen] = useState(null); // Stato per tracciare la schermata attiva

  const toggleAudio = () => {
    setIsAudioOn((prev) => !prev);
  };

  return (
    <AudioContext.Provider value={{ 
      isAudioOn, 
      setIsAudioOn, 
      toggleAudio, 
      activeScreen, 
      setActiveScreen // Espone la funzione per impostare la schermata attiva
    }}>
      {children}
    </AudioContext.Provider>
  );
};
