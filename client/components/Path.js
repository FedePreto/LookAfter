import React, { useEffect, useState, useContext } from 'react';
import { StyleSheet, Text, View, Image, TouchableWithoutFeedback, TouchableOpacity, Animated } from 'react-native';
import * as Speech from 'expo-speech';
import { AudioContext } from './AudioProvider';
import { Ionicons } from '@expo/vector-icons';
import HamburgerMenu from './HamBurgerMenu';

export default function PathDetails({ route, navigation }) {
  const { artworkKey } = route.params || {};
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const { isAudioOn, setActiveScreen, activeScreen } = useContext(AudioContext);

  const artworkDetails = {
    david: {
      name: 'David',
      image: require('../assets/david.png'),
      description: [
        'Take 2 steps forward to reach the main corridor.',
        'Turn right at the statue of Venus.',
        'Proceed straight until you find David.',
      ],
      nextScreen: 'ConfirmArtwork',
    },
    monalisa: {
      name: 'Mona Lisa',
      image: require('../assets/monalisa.png'),
      description: [
        'Walk straight for 5 steps.',
        'Turn left at the end of the corridor.',
        'You will find Mona Lisa on your left.',
      ],
      nextScreen: 'ConfirmArtwork',
    },
  };

  const artwork = artworkDetails[artworkKey];
  const textToRead = `Here is the path to reach ${artwork?.name}. ${artwork?.description.join(' ')}`;

  if (!artwork) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Artwork details not found</Text>
      </View>
    );
  }

  const handleProceed = () => {
    navigation.navigate(artwork.nextScreen, { artworkKey });
  };

  const handleReplayAudio = () => {
    Speech.stop();
    Speech.speak(textToRead);
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
      setDropdownVisible(false);
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
                source={require('../assets/audio_repeat.png')}
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
          <Text style={styles.artworkTitle}>{artwork.name}</Text>
          <View style={styles.instructions}>
            {artwork.description.map((step, index) => (
              <View key={index} style={styles.stepContainer}>
                <View style={styles.stepCircle}>
                  <Text style={styles.stepNumber}>{index + 1}</Text>
                </View>
                <Text style={styles.stepText}>{step}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Proceed Button */}
        <TouchableOpacity onPress={handleProceed} style={styles.proceedButton}>
          <Text style={styles.buttonText}>Proceed</Text>
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
    fontSize: 40, // H1: Enlarged for better visibility
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  instructions: {
    marginTop: 20,
    alignSelf: 'stretch',
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  stepCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007fbb',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  stepNumber: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  stepText: {
    fontSize: 24, // Enlarged text
    color: '#555',
    flex: 1,
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
