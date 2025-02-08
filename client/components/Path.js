import React, { useEffect, useState, useContext } from 'react';
import { StyleSheet, Text, View, Image, TouchableWithoutFeedback, TouchableOpacity, Animated } from 'react-native';
import HamburgerMenu from './HamBurgerMenu';
import * as Speech from 'expo-speech';
import { AudioContext } from './AudioProvider';
import { Ionicons } from '@expo/vector-icons';
import CustomNavigationBar from './CustomNavigationBar';
import theme from '../config/theme';
import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');

export default function PathDetails({ route, navigation }) {
  const { artworkKey } = route.params || {}; // Identifica quale opera gestire
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const { isAudioOn, setActiveScreen, activeScreen } = useContext(AudioContext); // Stato audio scelto dal menù

  const artworkDetails = {
    david: {
      name: 'David',
      image: require('../assets/david.png'),
      description: [
        'Proceed straight for 2 steps to reach the iconic sculpture, the Mona Lisa.',
        'Turn right and take 1 step after reaching the Mona Lisa.',
      ],
      nextScreen: 'ConfirmArtwork',
    },
    monalisa: {
      name: 'Mona Lisa',
      image: require('../assets/monalisa.png'),
      description: [
        'Proceed straight for 2 steps to reach the iconic sculpture, the David.',
        'Turn right and take 1 step after reaching the David.',
      ],
      nextScreen: 'ConfirmArtwork',
    },
  };

  const artwork = artworkDetails[artworkKey];

  const textToRead = `This is the ${artwork?.name}. ${artwork?.description.join(' ')}`;

  if (!artwork) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Artwork details not found</Text>
      </View>
    );
  }

  const handleProceed = () => {
    navigation.navigate(artwork.nextScreen, { artworkKey }); // Passa l'artworkKey
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
        <CustomNavigationBar
            navigation={navigation}
            isVisible={dropdownVisible} 
            toggleDropdown={toggleDropdown}
            showBackButton={true}
            showAudioButton={true}
            onReplayAudio={() => Speech.speak(textToRead)}
            />
       
        <Image source={artwork.image} style={styles.headerImage} />
        {/* Main Content */}
        <View style={styles.content}>
          <View style={styles.directionContainer}>
            <Text style={styles.directionHeader}>Route Information</Text>
            {artwork.description.map((step, index) => (
              <View key={index} style={styles.stepContainer}>
                <View style={styles.stepIndicator}>
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  
 
  headerImage: {
    width: 140,
    height: 140,
    resizeMode: 'contain',
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#54A8E8',
    shadowColor: '#54A8E8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
    top: '15%',
    alignContent: 'center',
    zIndex: 30,
  },

  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 0,
  },

  directionContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
    width: '90%',
  },

  directionHeader: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 0,
    color: '#007fbb',
  },
  
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  stepIndicator: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#007fbb',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  stepNumber: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  stepText: {
    fontSize: 20,
    color: '#555',
    flex: 1,
    flexWrap: 'wrap',
  },
  proceedButton: {
    backgroundColor: '#007fbb',
    width: width * 0.92,
    height: height * 0.08,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 20,
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
