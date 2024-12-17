import React, {useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, TouchableWithoutFeedback, Animated } from 'react-native';
import HamburgerMenu from './HamBurgerMenu';
import { AudioContext } from './AudioProvider';
import * as Speech from 'expo-speech';

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
  const textToRead = `This is the ${artwork.name} and is the artwork ${artwork.number} of 2}.`;
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

  

  return (
    <TouchableWithoutFeedback onPress={() => dropdownVisible && __closeDropdown()}>
     <View style={styles.container}>
      <View style = {styles.header}>
        <HamburgerMenu navigation={navigation}  isVisible={dropdownVisible} />
      </View>
      
      <Text style={styles.title}>Choose the Artwork</Text>
      <Image source={artwork.image} style={styles.headerImage} />

      {/* Titolo dell'opera */}
      <Text style={styles.artworkTitle}>Title: {artwork.title}</Text>
      <Text style={styles.artworkTitle}>Artwork number: {artwork.number}/2</Text>
      {/* Pulsante "Choose" */}
      <TouchableOpacity onPress={handleChoose} style={styles.chooseButton}>
        <Text style={styles.chooseButtonText}>Choose</Text>
      </TouchableOpacity>

      {/* Pulsante "Back", visibile solo se backScreen è definito */}
      {artwork.backScreen && (
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>
      )}

      {/* Pulsante "Next", visibile solo se nextScreen è definito */}
      {artwork.nextScreen && (
        <TouchableOpacity onPress={handleNext} style={styles.nextButton}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      )}
    </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10, // Ensure it is above other content
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    top: 20,
  },
  headerImage: {
    width: 250,
    height: 350,
    marginBottom: 40,
    top:20,
  },
  artworkTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  chooseButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 10,
    width: 150,
    alignItems: 'center',
    marginBottom: 30,
  },
  chooseButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    backgroundColor: '#6c757d',
    padding: 15,
    borderRadius: 10,
    width: 120,
    alignItems: 'center',
  },
  nextButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 10,
    width: 120,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginTop: 50,
  },
});
