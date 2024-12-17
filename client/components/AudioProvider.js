import React, { createContext, useState, useEffect } from 'react';

export const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
  const [isAudioOn, setIsAudioOn] = useState(false);
  const [activeScreen, setActiveScreen] = useState(null); // Stato per tracciare la schermata attiva

  const toggleAudio = () => {
    setIsAudioOn((prev) => !prev);
  };

  // Effetto per attivare l'audio quando cambia la schermata attiva
  useEffect(() => {
    if (activeScreen) {
      setIsAudioOn(true); // Accendi l’audio di default
    }
  }, [activeScreen]);

  return (
    <AudioContext.Provider value={{ 
      isAudioOn, 
      setIsAudioOn, 
      toggleAudio, 
      activeScreen, 
      setActiveScreen 
    }}>
      {children}
    </AudioContext.Provider>
  );
};
