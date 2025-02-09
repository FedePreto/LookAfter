import React, { useState, useContext } from 'react';
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { AudioContext } from './AudioProvider';
import Ionicons from '@expo/vector-icons/Ionicons';
import HamburgerMenu from './HamBurgerMenu'; 
import theme from '../config/theme';//
import * as Speech from 'expo-speech';

const CustomNavigationBar = ({ 
  navigation, 
  isVisible,
  toggleDropdown,
  showBackButton = true,       // Mostra o nasconde la freccia di back
  showAudioButton = true,      // Mostra o nasconde il pulsante audio
  onReplayAudio,               // Funzione opzionale per il pulsante audio
}) => {
  // const [dropdownVisible, setDropdownVisible] = useState(false);

  // const toggleDropdown = () => {
  //   setDropdownVisible(!dropdownVisible);
  // };
  const { isAudioOn, toggleAudio } = useContext(AudioContext); // Get the audio state from context
  console.log(isAudioOn)
  const handleReplayAudio = () => {

    if (!isAudioOn) {
      toggleAudio(); // Turn on audio if it's off
    }
    setTimeout(() => {
      Speech.stop(); // Stop any ongoing speech
      Speech.speak("Your audio content here"); // Replace with actual text
    }, 100);
    // if (isAudioOn) { // Only speak if audio is on
    //   Speech.stop(); // Stop any ongoing speech
    //   Speech.speak(onReplayAudio); // Replace with the actual text/audio
    // }
  };

  return (
    <View style={styles.container}>
      {/* <TouchableOpacity onPress={toggleDropdown} style={styles.menuButton}> */}
      <View style={styles.leftSection}>
      {/* Freccia di back */}
      {showBackButton && (
        <TouchableOpacity 
          onPress={() => navigation.goBack()}         
        >
          <Ionicons name="arrow-back" size={40} color="#000000" />
        </TouchableOpacity>
      )}
      </View>
      <View style={styles.rightSection}>
      {/* Pulsante audio */}
      {showAudioButton && (        
          <TouchableOpacity 
            onPress={handleReplayAudio}
          >
            <Image
              source={require('../assets/audio_repeat.png')} // Icona per il pulsante audio
              style={styles.audioIcon}
            />
          </TouchableOpacity>        
      )}

        {/* Menu hamburger */}
        <View>
          <HamburgerMenu 
            navigation={navigation} 
            isVisible={isVisible} 
            toggleDropdown={toggleDropdown} 
            audio = {onReplayAudio}
          />
        </View>
      </View>
      {/* </TouchableOpacity> */}
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
     
    flexDirection: 'row', // Arrange items horizontally
    //justifyContent: 'space-between', // Spread items to the left and right
    alignItems: 'center', // Align items vertically
    width: '100%', // Full width of the header  
    position: 'absolute',
    top: 0, // Position the header at the top
    zIndex: 1000,
    height: 60,
    backgroundColor: theme.colors.primary, // Header background color
  },  
  
  leftSection: {
    flex: 1, // Spazio riservato alla sinistra
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: 10,
  },

  rightSection: {
    flex: 1, // Spazio riservato alla destra
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  }, 
 
  audioIcon: {
    width: 40,
    height: 40,
  },  
});

export default CustomNavigationBar;
