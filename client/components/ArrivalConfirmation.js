import React, {useState, useContext, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableWithoutFeedback,TouchableOpacity, Alert, Animated } from 'react-native';
import HamburgerMenu from './HamBurgerMenu';
import { AudioContext } from './AudioProvider';
import * as Speech from 'expo-speech';
import { Ionicons } from '@expo/vector-icons';
const artworkDetails = {
  monalisa: {
    image: require('../assets/monalisa.png'),
    nextScreen: 'CameraConfirmation',
  },
  david: {
    image: require('../assets/david.png'),
    nextScreen: 'CameraConfirmation',
  },
};

export default function ConfirmArtwork({ route, navigation }) {
  const { artworkKey } = route.params || {}; // artworkKey per distinguere l'opera
  const artwork = artworkDetails[artworkKey];
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const { isAudioOn, setActiveScreen, activeScreen } = useContext(AudioContext);
  const textToRead = `To confirm that you have arrived to me please take a picture of me`;
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
        setActiveScreen('ArrivalConfirmation');
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }).start();
    
        if (isAudioOn && activeScreen === 'ArrivalConfirmation') {
          Speech.speak(textToRead);
        } else {
          Speech.stop();
        }
    
        return () => {
          Speech.stop();
        };
      }, [textToRead, isAudioOn]);

  if (!artwork) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Artwork not found</Text>
      </View>
    );
  }

  const handleProceed = () => {
    navigation.navigate(artwork.nextScreen, { artworkKey });
  };
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

    const handleReplayAudio = () => {
        Speech.stop();
        Speech.speak(textToRead); // Ripete l'audio da zero
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
        <Text style={styles.description}>
          To confirm that you have arrived to me please take a picture of me!
        </Text>
      </View>

      {/* Proceed Button */}
      <TouchableOpacity onPress={handleProceed} style={styles.proceedButton}>
        <Text style={styles.buttonText}>Take Picture</Text>
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
    bottom: 30,
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
    resizeMode:'contain',
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
    bottom:40,
  },
  proceedButton: {
    position: 'absolute',
    bottom: 70,
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
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginTop: 50,
  },
});
