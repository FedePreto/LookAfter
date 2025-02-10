import React, { useState, useContext, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, TouchableWithoutFeedback, Animated, SafeAreaView } from 'react-native';
import { AudioContext } from './AudioProvider';
import * as Speech from 'expo-speech';
import theme from '../config/theme';
import CustomNavigationBar from './CustomNavigationBar.js';
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function PreviewScreen({ route, navigation }) {
  const { images } = route.params || {}; // Receive the image from CameraScreen
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const { isAudioOn, setActiveScreen, activeScreen } = useContext(AudioContext);
  const textToRead = "Questa è un'anteprima della foto che hai scattato, per favore assicurati che tutto sia chiaro e riconoscibile prima di procedere.";
  const [fadeAnim] = useState(new Animated.Value(0));
  
    useEffect(() => {
      if (isAudioOn) {
        Speech.speak(textToRead); // Parla solo se isAudioOn è true
      }
      
      return () => {
        Speech.stop(); // Ferma la riproduzione quando si esce dalla schermata
      };
    }, [isAudioOn]); // Dipendenza: si aggiorna se cambia isAudioOn

    useEffect(() => {
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }).start();
      }, []);

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
          onReplayAudio={() => Speech.speak(textToRead)}
        />
        <View style={styles.titleContainer}>
          <Text style={styles.text}>Does the image look good?</Text>
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
            <Text style={styles.textButton2}>Re-Take</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={__chooseArtwork} style={styles.button}>
            <Text style={styles.textButton}>Proceed</Text>
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
    width: width,
    height: height * 0.5, // 40% dell'altezza dello schermo
    // borderRadius: 15,
    // shadowColor: '#000', // Subtle shadow for depth
    // // shadowOffset: { width: 0, height: 4 },
    // shadowOpacity: 0.2,
    // shadowRadius: 6,
    // elevation: 5, // Android shadow
    // borderWidth: 1,
    // borderColor: '#ddd', // Grigio chiaro per il bordo delle immagini
    resizeMode: 'contain',
    top:20,
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
    backgroundColor: '#007fbb', // blu per i bottoni
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
    color: '#007fbb', // Bianco per il testo nei bottoni
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

