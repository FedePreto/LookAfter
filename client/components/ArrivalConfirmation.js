import React, { useState, useContext, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableWithoutFeedback, TouchableOpacity, Alert, Animated } from 'react-native';
import HamburgerMenu from './HamBurgerMenu';
import { AudioContext } from './AudioProvider';
import * as Speech from 'expo-speech';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import theme from '../config/theme';

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
      <SafeAreaView style={styles.container}>
        {/* Header Section */}
        <View style={styles.header}>
                <View style={styles.curvedBackground}></View>
        
                  <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={40} color="#333" />
                  </TouchableOpacity>
                  
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
                <Image source={artwork.image} style={styles.headerImage} />

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
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  description: {
    fontSize: 24, // H2
    color: theme.colors.textPrimary,
    textAlign: 'center',
    marginBottom: 20,
    bottom: 40,
  },
  backButton: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10, 
    top:0,
    right: -10,
  },
  curvedBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: theme.colors.primary, // Curved background color

  },
  header: {
    flexDirection: 'row', // Arrange items horizontally
    justifyContent: 'space-between', // Spread items to the left and right
    alignItems: 'center', // Align items vertically
    width: '115%', // Full width of the header
    height: '100%',
    paddingHorizontal: 16, // Add padding to the sides
    paddingVertical: 0, // Add padding to the top and bottom
    position: 'fixed',
    top: 0, // Position the header at the top
    zIndex: 20,
    height: 60,
    right: 20,
  },
  
  headerHambuerger: {
    justifyContent: 'center',
    alignItems: 'center',
    right: 20,
    top: 0,
  },
  headerImage: {
    width: 140,
    height: 140,
    resizeMode: 'contain',
    borderRadius: 50,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
    top: 10,
    left: 120,
    zIndex: 30,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 40,
    height: 40,
    marginLeft: 10,
    top: 0,
    left: 80,
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
    backgroundColor: theme.colors.primary,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
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
