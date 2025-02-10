import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, TouchableWithoutFeedback, Animated } from 'react-native';
import { AudioContext } from './AudioProvider';
import * as Speech from 'expo-speech';
import { Dimensions } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler'; // Import PanGestureHandler
import CustomNavigationBar from './CustomNavigationBar.js';
import theme from '../config/theme';

const { width, height } = Dimensions.get('window');

const artworkDetails = {
  david: {
    title: "Il David",
    image: require('../assets/david.png'),
    nextScreen: 'monalisa',
    backScreen: null,
    artworkKey: 'david',
    number: 1,
  },
  monalisa: {
    title: "La Monalisa",
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
  const textToRead = `Sono ${artwork.title}, opera d'arte ${artwork.number} su 2.`;
  const [fadeAnim] = useState(new Animated.Value(0));

  
    useEffect(() => {
          if (isAudioOn) {
            Speech.speak(textToRead); // Parla solo se isAudioOn è true
          }
          
          return () => {
            Speech.stop(); // Ferma la riproduzione quando si esce dalla schermata
          };
        }, [isAudioOn, textToRead]); // Dipendenza: si aggiorna se cambia isAudioOn
    
        useEffect(() => {
            Animated.timing(fadeAnim, {
              toValue: 1,
              duration: 2000,
              useNativeDriver: true,
            }).start();
          }, []);
    

  // useEffect(() => {
  //   setActiveScreen('ChooseArtwork');
  //   Animated.timing(fadeAnim, {
  //     toValue: 1,
  //     duration: 2000,
  //     useNativeDriver: true,
  //   }).start();

  //   if (isAudioOn && activeScreen === 'ChooseArtwork') {
  //     Speech.speak(textToRead);
  //   } else {
  //     Speech.stop();
  //   }

  //   return () => {
  //     Speech.stop();
  //   };
  // }, [textToRead, isAudioOn]);

  if (!artwork) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Artwork not found</Text>
      </View>
    );
  }

  const handleNext = () => {
    if (artwork.nextScreen) {
      Speech.stop();
      navigation.navigate('ChooseArtwork', { artworkKey: artwork.nextScreen });
    }
  };

  const handleBack = () => {
    if (artwork.backScreen) {
      Speech.stop();
      navigation.navigate('ChooseArtwork', { artworkKey: artwork.backScreen });
    }
  };

  const handleChoose = () => {
    Speech.stop();
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

    if (translationX < -100 && artwork.number<2 ) {//currently max 2 artworks
      handleNext(); // Swipe left per pagina successiva
    } else if (translationX > 100 && artwork.number>1) {
      handleBack(); // Swipe right per pagina precedente
    }
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

        {/* Titolo */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Scegli opera d'arte</Text>
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
          <Text style={styles.artworkSubtitle}>Numero opera: {artwork.number}/2</Text>
        </View>

        <View style={styles.buttonsWrapper}>
        <TouchableOpacity onPress={handleChoose} style={styles.chooseButton}>
          <Text style={styles.chooseButtonText}>Scegli</Text>
        </TouchableOpacity>

        {/* Pulsanti */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            onPress={handleBack}
            style={[styles.buttons, artwork.backScreen ? styles.enabledButton : styles.disabledButton]}
            disabled={!artwork.backScreen}
          >
            <Text style={styles.buttonText}>Precedente</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleNext}
            style={[styles.buttons, artwork.nextScreen ? styles.enabledButton : styles.disabledButton]}
            disabled={!artwork.nextScreen}
          >
            <Text style={styles.buttonText}>Successivo</Text>
          </TouchableOpacity>
        </View>
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
  titleContainer: {
    flex: 0.2,
    justifyContent: 'center',
    alignItems: 'center',
    top: -width * 0.15,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    color: theme.colors.textSecondary,
    marginTop: height * 0.1,
  },
  imageContainer: {
    flex: 0.4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  artworkImage: {
    width: width * 0.9,
    height: width * 0.9,
    resizeMode: 'contain',
  },
  infoContainer: {
    flex: 0.2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  artworkTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: theme.colors.textSecondary,
    marginTop: height * 0.1,
  },
  artworkSubtitle: {
    fontSize: 20,
    textAlign: 'center',
    color: theme.colors.textSecondary,
  },
  buttonsWrapper: {
    // position: 'absolute',
    alignSelf: 'stretch', // Ensures it spans full width
    alignItems: 'center',
    paddingHorizontal: width * 0.04,
    // paddingVertical: 20,
    top: 60
    // marginBottom: height * 0.004, // Space from bottom
  },
  
  chooseButton: {
    backgroundColor: '#28a745', // Green
    width: width * 0.92, // Set width to match Previous/Next buttons
    height: height * 0.08,
    // width: '100%',
    height: height * 0.08,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    // position: 'absolute',
    marginBottom: -20, // Added margin to separate from Previous/Next buttons
  },
   // chooseButton: {
  //   backgroundColor: '#28a745', // Verde
  //   width: width * 0.92,
  //   height: height * 0.08,
  //   borderRadius: 15,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   position: 'absolute',
  //   bottom: 20,
  // },
  
  // buttonsContainer: {
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  //   width: '100%',
  // },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: width,
    paddingHorizontal: width * 0.04,
    marginBottom: 20,
  },
  buttons: {
    width: width * 0.45,
    height: height * 0.08,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: height * 0.03,
  },
  enabledButton: {
    backgroundColor: '#007fbb', // Blu
  },
  disabledButton: {
    backgroundColor: '#A9A9A9', // Grigio disabilitato
  },
  // chooseButton: {
  //   backgroundColor: '#28a745', // Verde
  //   width: width * 0.92,
  //   height: height * 0.08,
  //   borderRadius: 15,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   position: 'absolute',
  //   bottom: 20,
  // },
  chooseButtonText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
  },
});