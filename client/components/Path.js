import React, { useEffect, useState, useContext, useCallback } from 'react';
import { StyleSheet, Text, View, Image, TouchableWithoutFeedback, TouchableOpacity, Animated } from 'react-native';
import HamburgerMenu from './HamBurgerMenu';
import * as Speech from 'expo-speech';
import { AudioContext } from './AudioProvider';
import { Ionicons } from '@expo/vector-icons';
import CustomNavigationBar from './CustomNavigationBar';
import theme, {useCustomFonts}from '../config/theme';
import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');
import { useFocusEffect, useNavigation } from '@react-navigation/native';

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
        "Prosegui dritto per 2 passi per raggiungere il dipinto iconico, la Monalisa."  ,
        "Poi gira a destra e fai un passo e sarai di fronte a me."
      ],
      nextScreen: 'ConfirmArtwork',
    },
    monalisa: {
      name: 'La Monalisa',
      image: require('../assets/monalisa.png'),
      description: [
        'Prosegui dritto per 2 passi e mi avrai raggiunta.',
      ],
      nextScreen: 'ConfirmArtwork',
    },
  };

  const artwork = artworkDetails[artworkKey];

  const textToRead = `Sono ${artwork?.name}, grazie per avermi scelto. Adesso ti indicherò come raggiungermi. ${artwork?.description.join(' ')} Una volta fatto, premi su Prosegui.`;

  if (!artwork) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Artwork details not found</Text>
      </View>
    );
  }

   useFocusEffect(
      useCallback(() => {
        setActiveScreen('Path'); // Update the active screen
        
        if (fontsLoaded && isAudioOn) {
          Speech.stop(); // Stop any ongoing speech
          
          setTimeout(() => {
            // console.log("Speaking:", textToRead); // Debugging: Check if this runs
            
            Speech.speak(textToRead, {
              language: 'it-IT', // Ensure Italian is selected if needed
              pitch: 1.0, // Normal pitch
              rate: 0.9, // Adjust speed if needed
              // onStart: () => console.log("Speech started"),
              // onDone: () => console.log("Speech finished"),
              // onError: (error) => console.error("Speech error:", error),
            });
          }, 500); // Delay to ensure smooth playback
        }
    
        return () => {
          Speech.stop(); // Stop speech when leaving the screen
        };
      }, [fontsLoaded, isAudioOn, textToRead])
    );
    
  
  // Dipendenza: si aggiorna se cambia isAudioOn
  
      useEffect(() => {
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }).start();
        }, []); // Dipendenza: si aggiorna se cambia isAudioOn

  const handleProceed = () => {
    Speech.stop();
    navigation.navigate(artwork.nextScreen, { artworkKey }); // Passa l'artworkKey
  };

  const handleReplayAudio = () => {
    Speech.stop();
    Speech.speak(textToRead); // Ripete l'audio
  };

  const [fadeAnim] = useState(new Animated.Value(0));

  // useEffect(() => {
  //   setActiveScreen('Path');

  //   Animated.timing(fadeAnim, {
  //     toValue: 1,
  //     duration: 2000,
  //     useNativeDriver: true,
  //   }).start();

  //   if (isAudioOn && activeScreen === 'Path') {
  //     Speech.speak(textToRead);
  //   } else {
  //     Speech.stop();
  //   }

  //   return () => {
  //     Speech.stop();
  //   };
  // }, [textToRead, isAudioOn]);

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
        
        {/* Main Content */}
        <View style={styles.content}>
          <View style={styles.directionContainer}>
            <Text style={styles.directionHeader}>Informazioni di percorso</Text>
            {artwork.description.map((step, index) => (
              <View key={index} style={styles.stepContainer}>
                <View style={styles.stepIndicator}>
                  <Text style={styles.stepNumber}>{index + 1}</Text>
                </View>
                <Text style={styles.stepText}>{step}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Proceed Button */}
        <TouchableOpacity onPress={handleProceed} style={styles.proceedButton}>
          <Text style={styles.buttonText}>Prosegui</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
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

  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    bottom:20,
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
    width: '76%',
  },

  artworkTitle: {
    fontSize: 40,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 40, // Aggiunge spazio sopra
    color: '#0055A4',
    top: '10%', // Posiziona in alto
    width: '100%',
  },
  

  directionHeader: {
    fontSize: 34,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 0,
    color: '#0055A4',
  },
  
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  stepIndicator: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#0055A4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  stepNumber: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  stepText: {
    fontSize: 24,
    color: '#555',
    flexWrap: 'wrap',
    width: '100%',
    flexShrink: 1, // Prevents text from being cut off
    lineHeight: 24, // Ensures text is readable
    overflow: 'visible', // Allows text to appear fully
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
    fontSize: 22,
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 22,
    color: 'red',
    textAlign: 'center',
    marginTop: 50,
  },
});
