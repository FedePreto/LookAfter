import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, Image, Alert, TouchableOpacity, Animated,TouchableWithoutFeedback } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import HamburgerMenu from './HamBurgerMenu';
import { AudioContext } from './AudioProvider';
import * as Speech from 'expo-speech';
import { Ionicons } from '@expo/vector-icons';

export default function ArtworkReached({ navigation }) {
  const route = useRoute(); // Ottieni il route
  const { artworkKey } = route.params || {}; // Estrai artworkKey dai parametri

  const { isAudioOn, setActiveScreen, activeScreen } = useContext(AudioContext);
  const textToRead = `Congratulation you reacherd me, now touch the get info about me button!`;
  const [fadeAnim] = useState(new Animated.Value(0));
  const [dropdownVisible, setDropdownVisible] = useState(false);

  useEffect(() => {
            setActiveScreen('ArtworkReached');
            Animated.timing(fadeAnim, {
              toValue: 1,
              duration: 2000,
              useNativeDriver: true,
            }).start();
        
            if (isAudioOn && activeScreen === 'ArtworkReached') {
              Speech.speak(textToRead);
            } else {
              Speech.stop();
            }
        
            return () => {
              Speech.stop();
            };
  }, [textToRead, isAudioOn]);
  
  const handleProceed = () => {
    navigation.navigate('ArtworkInformations', { artworkKey });
  };

  // Mappa delle immagini in base a artworkKey
  const images = {
    monalisa: require('../assets/monalisa.png'),
    david: require('../assets/david.png'),
  };

  // Seleziona l'immagine corretta o un'immagine predefinita
  const artworkImage = images[artworkKey] ;
  const handleIconClick = () => {
      Alert.alert('Icon Clicked!', 'You clicked the audio icon.');
    };

    const toggleDropdown = () => {
      setDropdownVisible(!dropdownVisible);
    };
  
    const handleOutsidePress = () => {
      if (dropdownVisible) {
        setDropdownVisible(false); // Close the menu if it's open
      }
    };
  return (
    <TouchableWithoutFeedback onPress={handleOutsidePress}>
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
              <HamburgerMenu navigation={navigation} isVisible={dropdownVisible} toggleDropdown={toggleDropdown}/>
            </View>
      
      {/* Main Content */}
      <View style={styles.content}>
        <Text style={styles.description}>
          Congratulations, you reached me!
        </Text>
      </View>

      {/* Process button */}
      <TouchableOpacity onPress={handleProceed} style={styles.proceedButton}>
        <Text style={styles.buttonText}>Get Info about me</Text>
      </TouchableOpacity>
    </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F0FF',
    padding: 40,
  },
  description: {
    fontSize: 30,
    color: '#333',
    textAlign: 'center', // Center-align the text horizontally
    marginBottom: 20, // Adds space above the button
  },
  header: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
  },
  headerImage: {
    width: 100,
    height: 100,
    resizeMode:'contain',
    left: 70,
  },
  headerIcons: {
    flexDirection: 'row',
    left: 50,
    bottom: 40,
  },
  icon: {
    width: 30,
    height: 30,
    marginLeft: 10,
    top:10,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  proceedButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#007fbb',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
