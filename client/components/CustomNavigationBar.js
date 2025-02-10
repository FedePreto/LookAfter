import React, { useState, useContext } from 'react';
import { View, TouchableOpacity, StyleSheet, Image, Text } from 'react-native';
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
  showNextArtwork = false,
}) => {
  // const [dropdownVisible, setDropdownVisible] = useState(false);

  // const toggleDropdown = () => {
  //   setDropdownVisible(!dropdownVisible);
  // };
  const { isAudioOn, toggleAudio } = useContext(AudioContext); // Get the audio state from context
  // console.log(isAudioOn)
  const handleReplayAudio = () => {

    if (!isAudioOn) {
      toggleAudio(); // Turn on audio if it's off
    }
    setTimeout(() => {
      Speech.stop(); // Stop any ongoing speech
      Speech.speak(onReplayAudio()); // Replace with actual text
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
          <Ionicons name="arrow-back" size={40} color="white" />
        </TouchableOpacity>
      )}
      {showNextArtwork && (
        <TouchableOpacity
              onPress={() => navigation.navigate('ChooseArtwork', { artworkKey: 'david' })}
              style={styles.otherArtworksButton}>
              <Text style={styles.otherArtworksText}>Altre opere d'arte</Text>
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
                    source={require('../assets/white_icon_bg.png')} // Icona per il pulsante audio
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
    alignItems: 'center', // Align items vertically
    width: '100%', // Full width of the header  
    position: 'absolute',
    top: 0, // Position the header at the top
    zIndex: 1000,
    height: 60,
    backgroundColor: '#007fbb', // Header background color (consistent blue)
    // Remove shadow and elevation to ensure a uniform color
    shadowColor: 'transparent', // Prevent shadows if not needed
    shadowOffset: { width: 0, height: 0 }, // Reset shadow offset
    shadowOpacity: 0, // Reset shadow opacity
    elevation: 0, // Reset elevation
  },

  leftSection: {
    flex: 1, // Space on the left side
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: 10,
  },

  rightSection: {
    flex: 1, // Space on the right side
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: 'transparent', // Ensure no background color conflict here
  }, 

  audioIcon: {
    width: 35,
    height: 36,
  },
  otherArtworksButton: {
    backgroundColor: '#007fbb',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    borderWidth: 2,        // Set the border width to your desired thickness
    borderColor: '#007fbb', // Set the border color to white
  },
  
  otherArtworksText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});


export default CustomNavigationBar;
