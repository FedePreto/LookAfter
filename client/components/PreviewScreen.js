import React, { useState, useContext, useCallback, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, TouchableWithoutFeedback, Animated, SafeAreaView } from 'react-native';
import { AudioContext } from './AudioProvider';
import * as Speech from 'expo-speech';
import theme, {useCustomFonts} from '../config/theme';
import CustomNavigationBar from './CustomNavigationBar.js';
import { Dimensions } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

export default function PreviewScreen({ route, navigation }) {
   const fontsLoaded = useCustomFonts();
  const { images } = route.params || {}; // Receive the image from CameraScreen
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const { isAudioOn, setActiveScreen, activeScreen } = useContext(AudioContext);
  const textToRead = "Questa è un'anteprima della foto che hai scattato. Se non desideri rifare la foto premi su procedi.";
  const [fadeAnim] = useState(new Animated.Value(0));
  
    useFocusEffect(
        useCallback(() => {
          setActiveScreen('PreviewScreen'); // Update the active screen
          
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

  // useEffect(() => {
  //   setActiveScreen('Preview');
  //   Animated.timing(fadeAnim, {
  //     toValue: 1,
  //     duration: 2000,
  //     useNativeDriver: true,
  //   }).start();

  //   if (isAudioOn && activeScreen === 'Preview') {
  //     Speech.speak(textToRead);
  //   } else {
  //     Speech.stop();
  //   }

  //   return () => {
  //     Speech.stop();
  //   };
  // }, [textToRead, isAudioOn]);

  const __closeDropdown = () => {
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleOutsidePress = () => {
    if (dropdownVisible) {
      setDropdownVisible(false); // Close the menu if it's open
    }
  };

  const __retakePicture = () => {
    Speech.stop();
    navigation.goBack(); // Go back to CameraScreen
  };

  const __chooseArtwork = () => {
    Speech.stop();
    navigation.navigate('ChooseArtwork', { artworkKey: 'david' }); // Navigate to ChooseArtworkScreen
  };

  return (
    <TouchableWithoutFeedback onPress={handleOutsidePress}>
      <View style={styles.container}>
        <CustomNavigationBar
          navigation={navigation}
          isVisible={dropdownVisible} 
          toggleDropdown={toggleDropdown}
          showBackButton={false}
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
        <View style={styles.titleContainer}>
          <Text style={styles.text}>Anteprima foto</Text>
          {images ? (
          // Single Image - Display directly
          <Image source={{ uri: images }} style={styles.image} />
        ) : (
          // No Images
          <Text style={styles.noImagesText}>No images captured</Text>
        )}
        </View>

        
        
    

        

        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={__retakePicture} style={styles.button2}>
            <Text style={styles.textButton2}>Rifai foto</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={__chooseArtwork} style={styles.button}>
            <Text style={styles.textButton}>Procedi</Text>
          </TouchableOpacity>
        </View>
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
  text: {
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    color: theme.colors.textSecondary,
    marginTop: height * 0.1,
  },
  image: {
    marginTop: 30, 
    width: "100%",  // Occupa tutto lo spazio disponibile
    height: undefined, // Permette il ridimensionamento dinamico
    aspectRatio: 1, // Mantiene il rapporto originale (puoi rimuoverlo se vuoi adattarlo liberamente)
    borderRadius: 12, 
    alignSelf: "center",
    resizeMode: "contain" // Assicura che l'immagine non venga tagliata
  },
  
  noImagesText: {
    fontSize: 18,
    color: 'gray',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: width,
    padding: 0,
    position: 'absolute',
    bottom: 10,
  },
  button: {
    backgroundColor: '#0055A4', // blu per i bottoni
    paddingVertical:15,
    borderRadius: 15,
    width: width * 0.46,
    height: height * 0.08,
    alignItems: 'center',
    elevation: 6,
    bottom: 20,
  },
  button2: {
    backgroundColor: '#FFFFFF', // blu per i bottoni
    paddingVertical:15,
    borderRadius: 15,
    width: width * 0.46,
    height: height * 0.08,
    alignItems: 'center',
    elevation: 6,
    bottom: 20,
  },
  textButton: {
    color: '#FFFFFF', // Bianco per il testo nei bottoni
    fontSize: 22,
    fontWeight: 'bold',
  },
  textButton2: {
    color: '#0055A4', // Bianco per il testo nei bottoni
    fontSize: 22,
    fontWeight: 'bold',
  }, 
  titleContainer: {
    // flex: 0.2,
    justifyContent: 'center',
    alignItems: 'center',
    top: -width * 0.25,
  },
  imageContainer: {
    flex: 0.4,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

