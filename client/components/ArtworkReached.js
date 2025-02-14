import React, { useEffect, useState, useContext, useCallback } from 'react';
import { StyleSheet, Text, View, Image, Alert, TouchableWithoutFeedback, TouchableOpacity, Animated } from 'react-native';
import HamburgerMenu from './HamBurgerMenu';
import * as Speech from 'expo-speech';
import { AudioContext } from './AudioProvider';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Dimensions } from 'react-native';
import theme, {useCustomFonts} from '../config/theme';
import CustomNavigationBar from './CustomNavigationBar.js';
const { width, height } = Dimensions.get('window');

export default function PathDetails({ route, navigation }) {
  const fontsLoaded = useCustomFonts();
  const { artworkKey } = route.params || {}; // Identifica quale opera gestire
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const { isAudioOn, setActiveScreen, activeScreen } = useContext(AudioContext); // Stato audio scelto dal menù

  const artworkDetails = {
    david: {
      name: 'Il David',
      image: require('../assets/david.png'),
      description: [
        'Congratulazioni! mi hai raggiunto',
      ],
      nextScreen: 'ConfirmArtwork',
    },
    monalisa: {
      name: 'Mona Lisa',
      image: require('../assets/monalisa.png'),
      description: [
        'Congratulazioni! mi hai raggiunta',
      ],
      nextScreen: 'ConfirmArtwork',
    },
  };

  const artwork = artworkDetails[artworkKey];

  const textToRead = "Congratulazioni! mi hai raggiunto. Per saperne di più premi sul pulsante Conoscimi meglio";

  if (!artwork) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Artwork details not found</Text>
      </View>
    );
  }

  const handleProceed = () => {
    Speech.stop();
    navigation.navigate('ArtworkInformations', { artworkKey });
  };

  const handleReplayAudio = () => {
    Speech.stop();
    Speech.speak(textToRead); // Ripete l'audio
  };

  const [fadeAnim] = useState(new Animated.Value(0));

  useFocusEffect(
      useCallback(() => {
        setActiveScreen('ArtworkReached'); // Update the active screen
        
        if (fontsLoaded && isAudioOn) {
          Speech.stop(); // Stop any ongoing speech
          
          setTimeout(() => {
            console.log("Speaking:", textToRead); // Debugging: Check if this runs
            
            Speech.speak(textToRead, {
              language: 'it-IT', // Ensure Italian is selected if needed
              pitch: 1.0, // Normal pitch
              rate: 0.9, // Adjust speed if needed
              onStart: () => console.log("Speech started"),
              onDone: () => console.log("Speech finished"),
              onError: (error) => console.error("Speech error:", error),
            });
          }, 500); // Delay to ensure smooth playback
        }
    
        return () => {
          Speech.stop(); // Stop speech when leaving the screen
        };
      }, [fontsLoaded, isAudioOn, textToRead])
    );

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();
  }, []);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleOutsidePress = () => {
    if (dropdownVisible) {
      setDropdownVisible(false); // Chiude il menu se è aperto
    }
  };

  return (
    <TouchableWithoutFeedback onPress={handleOutsidePress}>
      <View style={styles.container}>
        <CustomNavigationBar
          navigation={navigation}
          isVisible={dropdownVisible} 
          toggleDropdown={toggleDropdown}
          showBackButton={true}
          showAudioButton={true}
          onReplayAudio={() => Speech.speak(textToRead, {
                                  language: 'it-IT', // Ensure Italian is selected if needed
                                  pitch: 1.0, // Normal pitch
                                  rate: 0.9, // Adjust speed if needed
                                  onStart: () => console.log("Speech started"),
                                  onDone: () => console.log("Speech finished"),
                                  onError: (error) => console.error("Speech error:", error),
                                })}
        />
      
        <View style ={styles.container2}>
          <Text style={styles.artworkTitle}>{artwork.name}</Text>
          <Image source={artwork.image} style={styles.headerImage} />
        </View>

        <View style={styles.content}>
          <View style={styles.directionContainer}>
            <Text style={styles.directionHeader}>Opera raggiunta</Text>
            <Text style={styles.stepText}>
            {artwork.description.map((desc, index) => (
            <Text key={index} style={styles.description}>{desc}</Text>
          ))}
            </Text>
          
          </View>
          
        </View>

        <TouchableOpacity onPress={handleProceed} style={styles.proceedButton}>
          <Text style={styles.buttonText}>Conoscimi meglio</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container2: {
    top: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  headerImage: {
    width: 160,
    height: 160,
    // borderRadius: 50,
    // borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: 'transparent',
    // shadowOffset: { width: 0, height: 4 },
    // shadowOpacity: 0.2,
    // shadowRadius: 6,
    // elevation: 5,
    top: '15%',
    alignContent: 'contain',
    resizeMode: 'contain',
    zIndex: 30,
  },
  artworkTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 40,
    color: '#0055A4',
    top: '10%',
    width: '100%',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 0,
  },
  description: {
    fontSize: 20,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
  },
  directionHeader: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#0055A4',
  },
  stepText: {
    fontSize: 20,
    color: '#555',
    textAlign: 'center',
    lineHeight: 30,
  },
  directionContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
    width: '90%',
  },
  proceedButton: {
    backgroundColor: '#0055A4',
    width: width * 0.92,
    height: height * 0.08,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 20,
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
