import React, { useEffect, useState, useContext } from 'react';
import { StyleSheet, Text, View, Image, Alert, TouchableWithoutFeedback, TouchableOpacity, Animated } from 'react-native';
import HamburgerMenu from './HamBurgerMenu';
import * as Speech from 'expo-speech';
import { AudioContext } from './AudioProvider';
import { Ionicons } from '@expo/vector-icons';

export default function PathDetails({ route, navigation }) {
  const { artworkKey } = route.params || {}; // Identifica quale opera gestire
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const { isAudioOn, setActiveScreen, activeScreen } = useContext(AudioContext); // Stato audio scelto dal menù

  const artworkDetails = {
    david: {
      name: 'David',
      image: require('../assets/david.png'),
      description: [
        'Congratulations! you reached me',
      ],
      nextScreen: 'ConfirmArtwork',
    },
    monalisa: {
      name: 'Mona Lisa',
      image: require('../assets/monalisa.png'),
      description: [
        'Congratulations! you reached me',
      ],
      nextScreen: 'ConfirmArtwork',
    },
  };

  const artwork = artworkDetails[artworkKey];

  const textToRead = `'Congratulations! you reached me'`;

  if (!artwork) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Artwork details not found</Text>
      </View>
    );
  }

  const handleProceed = () => {
    navigation.navigate('ArtworkInformations', { artworkKey });
  };

  const handleReplayAudio = () => {
    Speech.stop();
    Speech.speak(textToRead); // Ripete l'audio
  };

  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    setActiveScreen('Path');

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();

    if (isAudioOn && activeScreen === 'Path') {
      Speech.speak(textToRead);
    } else {
      Speech.stop();
    }

    return () => {
      Speech.stop();
    };
  }, [textToRead, isAudioOn]);

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
          <View style={styles.headerHambuerger}>
            <HamburgerMenu navigation={navigation} isVisible={dropdownVisible} toggleDropdown={toggleDropdown} />
          </View>
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          {/* Mappiamo ogni descrizione per renderizzarla separatamente */}
          {artwork.description.map((desc, index) => (
            <Text key={index} style={styles.description}>{desc}</Text>
          ))}
        </View>

        {/* Proceed Button */}
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
