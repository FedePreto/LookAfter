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
      <View style={styles.leftSection}>
      {/* Freccia di back */}
      {showBackButton && (
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={40} color="#000000" />
        </TouchableOpacity>
      )}
      </View>
      <View style={styles.rightSection}>
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
  backButton: {
    justifyContent: 'left',
    alignItems: 'left',
    left: 10,
    
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
  headerIcons: {
    left: 0,    
  },
 
  icon: {
    width: 40,
    height: 40,
    marginLeft: 10,
    top: 0,
    left: 0,
  },
  headerHamburger: {
    justifyContent: 'center',
    alignItems: 'center',
    left: 0,
    top: 0,
  },
});

export default CustomNavigationBar;
