import React, {useState, useEffect, useContext } from 'react';
import { SafeAreaView,StyleSheet, Text, View, Image, TouchableOpacity, TouchableWithoutFeedback, Animated } from 'react-native';
import HamburgerMenu from './HamBurgerMenu';
import { AudioContext } from './AudioProvider';
import * as Speech from 'expo-speech';
import { Dimensions } from 'react-native';
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
  const textToRead = `I am ${artwork.title} the artwork${artwork.number} of 2}.`;
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

  

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={handleOutsidePress}>
        <View style={styles.container}>
          
          {/* Header con Hamburger Menu */}
          <View style={styles.header}>
            <HamburgerMenu navigation={navigation} isVisible={dropdownVisible} toggleDropdown={toggleDropdown}/>
          </View>
          
          {/* Titolo */}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Choose the Artwork</Text>
          </View>
  
          {/* Immagine del David */}
          <View style={styles.imageContainer}>
            <Image source={artwork.image} style={styles.artworkImage} />
          </View>
  
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
    </SafeAreaView>
  );  
}  

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    justifyContent: 'space-between', // Distribuisce i contenuti
    alignItems: 'center', // Centra orizzontalmente
    padding: '5%', // Spaziatura uniforme
  },
  header: {
    position: 'absolute',
    top: '5%', // Margine superiore
    right: '5%', // Posizione del menu a destra
    zIndex: 10,
  },
  titleContainer: {
    flex: 0.2, // Occupa il 20% dello schermo
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: width * 0.07, // 7% della larghezza dello schermo
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
  },
  imageContainer: {
    flex: 0.4, // Occupa il 40% dello schermo
    justifyContent: 'center',
    alignItems: 'center',
  },
  artworkImage: {
    width: width * 0.9, // 60% della larghezza dello schermo
    height: width * 0.9, // Immagine quadrata
    resizeMode: 'contain',
  },
  infoContainer: {
    flex: 0.2, // Occupa il 20% dello schermo
    justifyContent: 'center',
    alignItems: 'center',
  },
  artworkTitle: {
    fontSize: width * 0.07, // 7% della larghezza dello schermo
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#555',
    marginBottom: height * 0.01,
  },
  artworkSubtitle: {
    fontSize: width * 0.04, // 4% della larghezza dello schermo
    textAlign: 'center',
    color: '#777',
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
    backgroundColor: '#007bff',
    paddingVertical: height * 0.02, // 2% dell'altezza dello schermo
    paddingHorizontal: width * 0.1, // 10% della larghezza
    borderRadius: 15,
    alignItems: 'center',
  },
  chooseButtonText: {
    color: '#fff',
    fontSize: width * 0.045, // 4.5% della larghezza dello schermo
    fontWeight: 'bold',
  },
  backButton: {
    backgroundColor: '#6c757d',
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.08,
    borderRadius: 15,
    alignItems: 'center',
  },
  nextButton: {
    backgroundColor: '#28a745',
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.08,
    borderRadius: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: width * 0.045,
    fontWeight: 'bold',
  },
});