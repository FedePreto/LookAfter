import React, { useState, useContext, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableWithoutFeedback, TouchableOpacity, Alert, Animated } from 'react-native';
import HamburgerMenu from './HamBurgerMenu';
import { AudioContext } from './AudioProvider';
import * as Speech from 'expo-speech';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomNavigationBar from './CustomNavigationBar.js';
import theme from '../config/theme';
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

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
  // console.log(artworkKey)
  // const artwork = artworkDetails[artworkKey];
  // console.log(artwork)
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const { isAudioOn, setActiveScreen, activeScreen } = useContext(AudioContext);
  const textToRead = `To confirm that you have arrived to me please take a picture of me`;
  const [fadeAnim] = useState(new Animated.Value(0));
  const artworkDetails = {
    david: {
      name: 'David',
      image: require('../assets/david.png'),
      description: [
        'Proceed straight for 2 steps to reach the iconic sculpture, the Mona Lisa.',
        'Turn right and take 1 step after reaching the Mona Lisa.',
      ],
      nextScreen: 'CameraConfirmation',
    },
    monalisa: {
      name: 'Mona Lisa',
      image: require('../assets/monalisa.png'),
      description: [
        'Proceed straight for 2 steps to reach the iconic sculpture, the David.',
        'Turn right and take 1 step after reaching the David.',
      ],
      nextScreen: 'CameraConfirmation',
    },
  };
  const artwork = artworkDetails[artworkKey];

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
          <CustomNavigationBar
            navigation={navigation}
            isVisible={dropdownVisible} 
            toggleDropdown={toggleDropdown}
            showBackButton={true}
            showAudioButton={true}
            onReplayAudio={() => Speech.speak(textToRead)}
          />
               <View style ={styles.container2}>
                         <Text style={styles.artworkTitle}>{artwork.name}</Text>
                         <Image source={artwork.image} style={styles.headerImage} />
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
    justifyContent: 'center',
    alignContent: 'center',
    backgroundColor: theme.colors.background,
  },
  container2: {
    top:0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  
  description: {
    fontSize: 30, // H2
    color: theme.colors.textPrimary,
    textAlign: 'center',
    marginBottom: 20,
    bottom: 40,
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

  artworkTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 40, // Aggiunge spazio sopra
    color: '#007fbb',
    top: '10%', // Posiziona in alto
    width: '100%',
  },

  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 0,
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
    fontSize: 20, // H3
    color: theme.colors.background,
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginTop: 50,
  },
});
