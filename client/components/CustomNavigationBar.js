import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import HamburgerMenu from './HamBurgerMenu'; 
import theme from '../config/theme';//

const CustomNavigationBar = ({ 
  navigation, 
  showBackButton = true,       // Mostra o nasconde la freccia di back
  showAudioButton = true,      // Mostra o nasconde il pulsante audio
  onReplayAudio,               // Funzione opzionale per il pulsante audio
}) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  return (
    <View style={styles.container}>
      {/* Sfondo curvo */}
      <View style={styles.curvedBackground}></View>

      {/* Freccia di back */}
      {showBackButton && (
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={40} color="#333" />
        </TouchableOpacity>
      )}

      {/* Pulsante audio */}
      {showAudioButton && (
        <View style={styles.headerIcons}>
          <TouchableOpacity 
            onPress={onReplayAudio} 
            style={styles.iconWrapper}
          >
            <Image
              source={require('../assets/audio_repeat.png')} // Icona per il pulsante audio
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>
      )}

      {/* Menu hamburger */}
      <View style={styles.headerHamburger}>
        <HamburgerMenu 
          navigation={navigation} 
          isVisible={dropdownVisible} 
          toggleDropdown={toggleDropdown} 
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
      flex: 1,
      backgroundColor: theme.colors.background, // Colore di sfondo dell'app
  },
  container: {
    flexDirection: 'row', // Arrange items horizontally
    justifyContent: 'space-between', // Spread items to the left and right
    alignItems: 'center', // Align items vertically
    width: '100%', // Full width of the header
    height: '100%',
    paddingHorizontal: 0, // Add padding to the sides
    paddingVertical: 0, // Add padding to the top and bottom
    position: 'absolute',
    top: 0, // Position the header at the top
    zIndex: 1000,
    height: 60,
    right: 0,
  },
  curvedBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: theme.colors.primary, // Curved background color
  },
  backButton: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10, 
    top:0,
    right: -10,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  //iconWrapper: {
    //padding: 5,
  //},
  icon: {
    width: 40,
    height: 40,
    marginLeft: 10,
    top: 0,
    left: 80,
  },
  headerHamburger: {
    justifyContent: 'center',
    alignItems: 'center',
    right: 20,
    top: 0,
  },
});

export default CustomNavigationBar;
