import React, { useState, useEffect, useContext } from 'react';
import { SafeAreaView, StyleSheet, Text, View, Image, TouchableOpacity, TouchableWithoutFeedback, Animated } from 'react-native';
import HamburgerMenu from './HamBurgerMenu';
import { AudioContext } from './AudioProvider';
import * as Speech from 'expo-speech';
import { Dimensions } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler'; // Import PanGestureHandler
import CustomNavigationBar from './CustomNavigationBar.js';
import theme from '../config/theme';

const { width, height } = Dimensions.get('window');

const artworkDetails = {
  david: {
    title: "The David",
    image: require('../assets/david.png'),
    nextScreen: 'monalisa',
    backScreen: null,
    artworkKey: 'david',
    number: 1,
  },
  monalisa: {
    title: "The Monalisa",
    image: require('../assets/monalisa.png'),
    nextScreen: null,
    backScreen: 'david',
    artworkKey: 'monalisa',
    number: 2,
  },
};

export default function ChooseArtworkScreen({ route, navigation }) {
  const { artworkKey } = route.params || {}; // Indica quale opera visualizzare
  const artwork = artworkDetails[artworkKey];
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const { isAudioOn, setActiveScreen, activeScreen } = useContext(AudioContext);
  const textToRead = `I am ${artwork.title} the artwork ${artwork.number} of 2.`;
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    setActiveScreen('ChooseArtwork');
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();

    if (isAudioOn && activeScreen === 'ChooseArtwork') {
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

  const handleNext = () => {
    if (artwork.nextScreen) {
      navigation.navigate('ChooseArtwork', { artworkKey: artwork.nextScreen });
    }
  };

  const handleBack = () => {
    if (artwork.backScreen) {
      navigation.navigate('ChooseArtwork', { artworkKey: artwork.backScreen });
    }
  };

  const handleChoose = () => {
    navigation.navigate('PathDetails', { artworkKey: artwork.artworkKey }); // Passa il parametro
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleOutsidePress = () => {
    if (dropdownVisible) {
      setDropdownVisible(false); // Close the menu if it's open
    }
  };

  // Pan Gesture Handler
  const onGestureEvent = (event) => {
    const { translationX } = event.nativeEvent;

    if (translationX > 100) {
      handleNext(); // Swipe right
    } else if (translationX < -100) {
      handleBack(); // Swipe left
    }
  };

  return (
    <TouchableWithoutFeedback onPress={handleOutsidePress}>
        <View style={styles.container}>          
          <CustomNavigationBar
            navigation={navigation}
            showBackButton={false}
            showAudioButton={false}
            onReplayAudio={() => Speech.speak(textToRead)}
          />
          
          {/* Titolo */}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Choose the Artwork</Text>
          </View>

          {/* Gesture Handler */}
          <PanGestureHandler onGestureEvent={onGestureEvent}>
            <View style={styles.imageContainer}>
              <Image source={artwork.image} style={styles.artworkImage} />
            </View>
          </PanGestureHandler>

          {/* Informazioni sull'opera */}
          <View style={styles.infoContainer}>
            <Text style={styles.artworkTitle}>{artwork.title}</Text>
            <Text style={styles.artworkSubtitle}>Artwork number: {artwork.number}/2</Text>
          </View>

          {/* Pulsanti */}
          <View style={styles.buttonsContainer}>
            <TouchableOpacity onPress={handleChoose} style={styles.chooseButton}>
              <Text style={styles.chooseButtonText}>Choose</Text>
            </TouchableOpacity>

            {artwork.backScreen && (
              <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                <Text style={styles.buttonText}>Previous</Text>
              </TouchableOpacity>
            )}

            {artwork.nextScreen && (
              <TouchableOpacity onPress={handleNext} style={styles.nextButton}>
                <Text style={styles.buttonText}>Next</Text>
              </TouchableOpacity>
            )}
          </View>
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
  header: {
    position: 'absolute',
    top: 50, // Margine superiore
    right: 20, // Posizione del menu a destra
    zIndex: 10,
  },
  titleContainer: {
    flex: 0.2, // Occupa il 20% dello schermo
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 36, // H1: 32-40px
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#444444', // Testo grigio scuro
    marginTop: height * 0.1, // Sposta il titolo più in basso
  },
  imageContainer: {
    flex: 0.4, // Occupa il 40% dello schermo
    justifyContent: 'center',
    alignItems: 'center',
  },
  artworkImage: {
    width: width * 0.9, // 90% della larghezza dello schermo
    height: width * 0.9, // Immagine quadrata
    resizeMode: 'contain',
  },
  infoContainer: {
    flex: 0.2, // Occupa il 20% dello schermo
    justifyContent: 'center',
    alignItems: 'center',
  },
  artworkTitle: {
    fontSize: 28, // 24-30px per H2
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#444444',
    marginBottom: height * 0.01,
  },
  artworkSubtitle: {
    fontSize: 20, // 18-20px per il testo secondario
    textAlign: 'center',
    color: '#777777', // Testo grigio più chiaro
  },
  buttonsContainer: {
    flex: 0.2, // Occupa il 20% dello schermo
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: '5%',
  },
  chooseButton: {
    backgroundColor: '#007BFF', // Blu
    paddingVertical: height * 0.02, // 2% dell'altezza dello schermo
    paddingHorizontal: width * 0.1, // 10% della larghezza
    borderRadius: 15,
    alignItems: 'center',
  },
  chooseButtonText: {
    color: '#FFFFFF', // Testo bianco
    fontSize: 20, // Testo grande per la leggibilità
    fontWeight: 'bold',
  },
  backButton: {
    backgroundColor: '#6c757d', // Grigio scuro per il pulsante di ritorno
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.08,
    borderRadius: 15,
    alignItems: 'center',
  },
  nextButton: {
    backgroundColor: '#28a745', // Verde per il pulsante successivo
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.08,
    borderRadius: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 20, // Font grande per visibilità
    fontWeight: 'bold',
  },
});
