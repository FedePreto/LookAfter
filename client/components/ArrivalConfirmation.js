import React, { useState, useContext, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableWithoutFeedback, TouchableOpacity, Alert, Animated } from 'react-native';
import HamburgerMenu from './HamBurgerMenu';
import { AudioContext } from './AudioProvider';
import * as Speech from 'expo-speech';
import { Ionicons } from '@expo/vector-icons';

const artworkDetails = {
  monalisa: {
    image: require('../assets/monalisa.png'),
    nextScreen: 'CameraConfirmation',
  },
  david: {
    image: require('../assets/david.png'),
    nextScreen: 'CameraConfirmation',
  },
};

export default function ConfirmArtwork({ route, navigation }) {
  const { artworkKey } = route.params || {};
  const artwork = artworkDetails[artworkKey];
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const { isAudioOn, setActiveScreen, activeScreen } = useContext(AudioContext);
  const textToRead = `To confirm that you have arrived to me please take a picture of me`;
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    setActiveScreen('ArrivalConfirmation');
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();

    if (isAudioOn && activeScreen === 'ArrivalConfirmation') {
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

  const handleProceed = () => {
    navigation.navigate(artwork.nextScreen, { artworkKey });
  };

  const handleIconClick = () => {
    Alert.alert('Icon Clicked!', 'You clicked the audio icon.');
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleOutsidePress = () => {
    if (dropdownVisible) {
      setDropdownVisible(false);
    }
  };

  const handleReplayAudio = () => {
    Speech.stop();
    Speech.speak(textToRead);
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
            To confirm that you have arrived to me please take a picture of me!
          </Text>
        </View>

        {/* Proceed Button */}
        <TouchableOpacity onPress={handleProceed} style={styles.proceedButton}>
          <Text style={styles.buttonText}>Take Picture</Text>
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
  description: {
    fontSize: 24, // H2
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
    bottom: 30,
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
    paddingVertical: 20,
    width: '100%',
    position: 'absolute',
    top: 10,
    zIndex: 10,
    backgroundColor: '#E8F0FF',
  },
  headerHamburger: {
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
    elevation: 5, // Android-specific shadow
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
    bottom: 40,
  },
  proceedButton: {
    position: 'absolute',
    bottom: 70,
    right: 20,
    backgroundColor: '#007fbb',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 20, // H3
    color: '#fff',
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginTop: 50,
  },
});
