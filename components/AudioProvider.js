import React, { createContext, useState } from 'react';

export const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
  const [isAudioOn, setIsAudioOn] = useState(false);

  const toggleAudio = () => {
    setIsAudioOn((prev) => !prev);
  };

  return (
    <AudioContext.Provider value={{ isAudioOn, setIsAudioOn, toggleAudio }}>
      {children}
    </AudioContext.Provider>
  );
};
