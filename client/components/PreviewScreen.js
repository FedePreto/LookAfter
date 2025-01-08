import React, { useState, useContext, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, TouchableWithoutFeedback, Animated, SafeAreaView } from 'react-native';
import { AudioContext } from './AudioProvider';
import * as Speech from 'expo-speech';
import theme from '../config/theme';
import CustomNavigationBar from './CustomNavigationBar.js';
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function PreviewScreen({ route, navigation }) {
  const { images } = route.params || {}; // Receive the image from CameraScreen
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const { isAudioOn, setActiveScreen, activeScreen } = useContext(AudioContext);
  const textToRead = `This is a preview of the picture you took, please make sure that everything is clear and recognisable before proceeding.`;
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    setActiveScreen('Preview');
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();

    if (isAudioOn && activeScreen === 'Preview') {
      Speech.speak(textToRead);
    } else {
      Speech.stop();
    }

    return () => {
      Speech.stop();
    };
  }, [textToRead, isAudioOn]);

  const __closeDropdown = () => {
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleOutsidePress = () => {
    if (dropdownVisible) {
      setDropdownVisible(false); // Close the menu if it's open
    }
  };

  const __retakePicture = () => {
    navigation.goBack(); // Go back to CameraScreen
  };

  const __chooseArtwork = () => {
    navigation.navigate('ChooseArtwork', { artworkKey: 'david' }); // Navigate to ChooseArtworkScreen
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
        <View>
          <Text style={styles.text}>Does the image look good?</Text>
        </View>

        {images ? (
          // Single Image - Display directly
          <Image source={{ uri: images }} style={styles.image} />
        ) : (
          // No Images
          <Text style={styles.noImagesText}>No images captured</Text>
        )}

        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={__retakePicture} style={styles.button}>
            <Text style={styles.textButton}>Re-Take</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={__chooseArtwork} style={styles.button}>
            <Text style={styles.textButton}>Proceed</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 26,
    fontWeight: 'bold',
    color: theme.colors.textSecondary,
  },
  image: {
    width: width,
    height: height * 0.4, // 40% dell'altezza dello schermo
    borderRadius: 15,
    shadowColor: '#000', // Subtle shadow for depth
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5, // Android shadow
    borderWidth: 1,
    borderColor: '#ddd', // Grigio chiaro per il bordo delle immagini
  },
  noImagesText: {
    fontSize: 18,
    color: 'gray',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: width,
    padding: 0,
    position: 'absolute',
    bottom: 10,
  },
  button: {
    backgroundColor: '#007BFF', // blu per i bottoni
    paddingVertical:20,
    borderRadius: 15,
    width: width * 0.4,
    height: width * 0.2,
    alignItems: 'center',
    shadowColor: 'black', // Shadow for depth
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 6,
  },
  textButton: {
    color: '#FFFFFF', // Bianco per il testo nei bottoni
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

