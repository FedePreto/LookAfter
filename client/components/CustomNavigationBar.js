import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import HamburgerMenu from './HamBurgerMenu'; 
import theme from '../config/theme';//

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
            onPress={onReplayAudio}
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
