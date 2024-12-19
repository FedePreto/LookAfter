import React, { useEffect, useState, useContext } from 'react';
import { StyleSheet, Text, View, Image, Alert, TouchableWithoutFeedback,TouchableOpacity, Animated } from 'react-native';
import HamburgerMenu from './HamBurgerMenu';
import * as Speech from 'expo-speech';
import { AudioContext } from './AudioProvider';
import { Ionicons } from '@expo/vector-icons';

export default function PathDetails({ route, navigation }) {
  const { artworkKey } = route.params || {}; // Identifica quale opera gestire
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const { isAudioOn, setActiveScreen, activeScreen } = useContext(AudioContext); //questo è lo stato dell'audio scelto dal menù

  const artworkDetails = {
    david: {
      name: 'David',
      image: require('../assets/david.png'),
      description: [
       '2 foots forward to reach the most iconic sculpture the Monalisa',
      '1 foot on the right once The Monalisa has been reached',
      ],
      nextScreen: 'ConfirmArtwork',
    },
    monalisa: {
      name: 'Mona Lisa',
      image: require('../assets/monalisa.png'),
      description: [
        '2 foots forward to reach the most iconic sculpture the david',
        '1 foot on the right once The David has been reached',
      ],
      nextScreen: 'ConfirmArtwork',
    },
  };

  const artwork = artworkDetails[artworkKey];

  // Combina tutte le descrizioni in un'unica stringa
  const textToRead = `This is the ${artwork.name}. ${artwork.description.join(' ')}`;

  if (!artwork) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Artwork details not found</Text>
      </View>
    );
  }

  const handleProceed = () => {
    navigation.navigate(artwork.nextScreen, { artworkKey }); // Passa l'artworkKey
  };

  const handleIconClick = () => {
    // Ripetere l'audio
    handleReplayAudio();
  };

  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    setActiveScreen('Path');

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();

    // Inizializza la lettura dell'audio
    if (isAudioOn && activeScreen === 'Path') { 
      Speech.speak(textToRead);
    }else{
      Speech.stop();
    }
    

    return () => {
      Speech.stop();
    };
  }, [textToRead, isAudioOn]);

  const handleReplayAudio = () => {
    Speech.stop();
    Speech.speak(textToRead); // Ripete l'audio da zero
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
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={40} color="#333" />
      </TouchableOpacity>
        <Image source={artwork.image} style={styles.headerImage} />
        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={handleReplayAudio} style={styles.iconWrapper}>
            <Image
              source={require('../assets/audio_repeat.png')} // Icona per il pulsante audio
              style={styles.icon}
            />
          </TouchableOpacity>
          </View>
          <View  style = {styles.headerHambuerger}>
            <HamburgerMenu navigation={navigation} isVisible={dropdownVisible} toggleDropdown={toggleDropdown}/>
          </View>
        
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <Text style={styles.description}>{artwork.description.join(' ')}</Text>
      </View>

      {/* Process Button */}
      <TouchableOpacity onPress={handleProceed} style={styles.proceedButton}>
        <Text style={styles.buttonText}>Proceed</Text>
      </TouchableOpacity>
    </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F0FF',
    padding: 20,
  },
  description: {
    fontSize: 30,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
    top:'90',
  },
  backButton: {
    padding: 8,
    top:'5',
  },
  header: {
    flexDirection: 'row', // Align items horizontally
    alignItems: 'center', // Center items vertically
    justifyContent: 'space-between', // Space elements evenly
    paddingHorizontal: 16, // Add padding on both sides
    paddingVertical: 30, // Add padding on top and bottom
    width: '100%', // Ensure it spans the full width
    position: 'absolute', // Keep it fixed at the top
    top: 10, // Position at the very top
    zIndex: 10, // Ensure it stays above other content
    backgroundColor: '#E8F0FF', // Optional: background color for header
  },
  headerHambuerger:{
    position: 'absolute',
    top: 70,
    right: 0,
    zIndex: 10,
  },
  headerImage: {
    width: 100,
  height: 100,
  resizeMode: 'contain',
  borderRadius: 50,
  borderWidth: 2,
  borderColor: '#ddd',
  shadowColor: '#000', // Shadow color
  shadowOffset: { width: 0, height: 4 }, // Position of the shadow
  shadowOpacity: 0.2, // Shadow transparency
  shadowRadius: 6, // Spread of the shadow
  elevation: 5, // Android-specific shadow
  },
  headerIcons: {
    flexDirection: 'row',
    right:'50',
    top:'10',
  },
  icon: {
    width: 30,
    height: 30,
    marginLeft: 10,
    top: 10,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 80,
  },
  proceedButton: {
    position: 'absolute',
    bottom: 50,
    right: 20,
    backgroundColor: '#d32f2f',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginTop: 50,
  },
});
