import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, Image, Alert, TouchableOpacity, Animated, TouchableWithoutFeedback } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import HamburgerMenu from './HamBurgerMenu';
import { AudioContext } from './AudioProvider';
import * as Speech from 'expo-speech';
import { Ionicons } from '@expo/vector-icons';

export default function ArtworkReached({ navigation }) {
  const route = useRoute(); // Ottieni il route
  const { artworkKey } = route.params || {}; // Estrai artworkKey dai parametri

  const { isAudioOn, setActiveScreen, activeScreen } = useContext(AudioContext);
  const textToRead = `Congratulations! You have reached me. Now, tap the "Get Info About Me" button!`;
  const [fadeAnim] = useState(new Animated.Value(0));
  const [dropdownVisible, setDropdownVisible] = useState(false);

  useEffect(() => {
    setActiveScreen('ArtworkReached');
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();

    if (isAudioOn && activeScreen === 'ArtworkReached') {
      Speech.speak(textToRead);
    } else {
      Speech.stop();
    }

    return () => {
      Speech.stop();
    };
  }, [textToRead, isAudioOn]);

  const handleProceed = () => {
    navigation.navigate('ArtworkInformations', { artworkKey });
  };

  // Mappa delle immagini in base a artworkKey
  const images = {
    monalisa: require('../assets/monalisa.png'),
    david: require('../assets/david.png'),
  };

  // Seleziona l'immagine corretta o un'immagine predefinita
  const artworkImage = images[artworkKey];
  
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
          {artworkImage && (
            <Image source={artworkImage} style={styles.headerImage} />
          )}
          <View style={styles.headerIcons}>
            <TouchableOpacity onPress={() => Speech.speak(textToRead)} style={styles.iconWrapper}>
              <Image
                source={require('../assets/audio_repeat.png')}
                style={styles.icon}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.headerHamburger}>
            <HamburgerMenu navigation={navigation} isVisible={dropdownVisible} toggleDropdown={toggleDropdown} />
          </View>
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          <Text style={styles.description}>
            Congratulations, you reached me!
          </Text>
        </View>

        {/* Process Button */}
        <TouchableOpacity onPress={handleProceed} style={styles.proceedButton}>
          <Text style={styles.buttonText}>Get Info About Me</Text>
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
  backButton: {
    padding: 8,
    top: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 30,
    width: '100%',
    position: 'absolute',
    top: 10,
    zIndex: 10,
    backgroundColor: '#E8F0FF',
  },
  headerHambuerger: {
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  headerIcons: {
    flexDirection: 'row',
    right: 50,
    top: 10,
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
  artworkTitle: {
    fontSize: 36, // H1: 32-40 px
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  description: {
    fontSize: 22, // H3: 20-24 px
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
  },
  proceedButton: {
    position: 'absolute',
    bottom: 50,
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
