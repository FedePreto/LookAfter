import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import * as Speech from 'expo-speech';
export const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
  const [isAudioOn, setIsAudioOn] = useState(true); // Initially set to null to detect if it's the first launch
  const [activeScreen, setActiveScreen] = useState(null);

  

  useEffect(() => {
    const loadAudioState = async () => {
      try {
        // const savedAudioState = await AsyncStorage.getItem('audioState');
        // console.log('Loaded saved audio state:', savedAudioState); // Check the saved state
        // setIsAudioOn(true);
        // If there is no saved state, set audio to ON and save it
        // if (savedAudioState === null) {
          setIsAudioOn(true);
          await AsyncStorage.setItem('audioState', JSON.stringify(true));
        // } else {
        //   // If there is a saved state, use that state
        //   setIsAudioOn(JSON.parse(savedAudioState));
        // }
      } catch (error) {
        console.error('Failed to load audio state', error);
        setIsAudioOn(true);  // Default to audio being ON in case of error
      }
    };
  
    loadAudioState();
  }, []);

  const toggleAudio = async () => {
    const newAudioState = !isAudioOn;
    setIsAudioOn(newAudioState);
    try {
      await AsyncStorage.setItem('audioState', JSON.stringify(newAudioState));
    } catch (error) {
      console.error('Failed to save audio state:', error);
    }
  };

   // Empty dependency array ensures this runs once when the app starts

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
