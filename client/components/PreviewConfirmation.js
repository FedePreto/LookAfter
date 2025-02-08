import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Animated,ScrollView,TouchableWithoutFeedback, SafeAreaView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native'; // Importa useRoute
import { Dimensions } from 'react-native';
import HamburgerMenu from './HamBurgerMenu';
import theme from '../config/theme';
import CustomNavigationBar from './CustomNavigationBar.js';
import { AudioContext } from './AudioProvider';
import * as Speech from 'expo-speech';


const { width, height } = Dimensions.get('window');

let newAccessCount = 0

export default function PreviewConfirmation({ route, navigation }) {
  const { images } = route.params || {}; // Receive images array from CameraScreen
  const { artworkKey } = route.params || {}; // Estrai artworkKey dai parametri
  const [accessCount, setAccessCount] = useState(newAccessCount); // Initial access count
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const { isAudioOn } = useContext(AudioContext); // Prende lo stato audio globale
  const textToRead = `This is a preview of the picture you took, please make sure that everything is clear and recognisable before proceeding.`;
  const [fadeAnim] = useState(new Animated.Value(0));

  const __retakePicture = () => {
    Speech.stop();
    navigation.goBack(); // Go back to CameraScreen
  };
  useEffect(() => {
    if (isAudioOn) {
      Speech.speak(textToRead); // Parla solo se isAudioOn è true
    }
    
    return () => {
      Speech.stop(); // Ferma la riproduzione quando si esce dalla schermata
    };
  }, [isAudioOn]); // Dipendenza: si aggiorna se cambia isAudioOn

  useEffect(() => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      }).start();
    }, []);

  const __chooseArtwork = () => {
    // navigation.navigate('ArtworkReached', { images, artworkKey }); 
    // navigation.navigate('AnotherArtworkReached', { images }); 
    // navigation.navigate('LostPage', { images });
    
    // setAccessCount(newAccessCount);
    
    Speech.stop();
    
    switch (newAccessCount) {
      case 0:
        navigation.navigate('ArtworkReached', { images, artworkKey });
        break;
      case 1:
        navigation.navigate('AnotherArtworkReached', { images, artworkKey });
        break;
      case 2:
        navigation.navigate('LostPage', { images });
        break;
      default:
        navigation.navigate('ArtworkReached', { images, artworkKey });
        break;
    }
    if(newAccessCount>2){
      newAccessCount =0
    }
    newAccessCount += 1; // Increment the global variable
    setAccessCount(newAccessCount); // Update local state to trigger a re-render
  };
  const isMultipleImages = Array.isArray(images);

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
            <CustomNavigationBar
                navigation={navigation}
                isVisible={dropdownVisible} 
                toggleDropdown={toggleDropdown}
                showBackButton={false}
                showAudioButton={true}
                onReplayAudio={() => Speech.speak(textToRead)}
                />
      {isMultipleImages ? (
        // Multiple Images - Display in a horizontal scroll
        <ScrollView
          horizontal
          pagingEnabled
          contentContainerStyle={styles.imageContainer}
        >
          {images.map((uri, index) => (
            <View key={index} style={styles.imageWrapper}>
              <Image source={{ uri }} style={styles.image} />
            </View>
          ))}
        </ScrollView>
      ) : images ? (
        // Single Image - Display directly
        <Image source={{ uri: images }} style={styles.image} />
      ) : (
        // No Images
        <Text style={styles.noImagesText}>No images captured</Text>
      )}
      <Text style={styles.text}>Does the image looks Good?</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={__retakePicture} style={styles.button2}>
          <Text style={styles.textButton2}>Re-Take</Text>
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
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background, // Colore di sfondo dell'app
  },
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
  imageContainer: {
    flexDirection: 'row', // Arrange images horizontally
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageWrapper: {
    width: 300, // Match image width for paging
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 300,
    height: 400,
    marginHorizontal: 10,
    borderRadius: 10,
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
    backgroundColor: '#007fbb', // blu per i bottoni
    paddingVertical:15,
    borderRadius: 15,
    width: width * 0.46,
    height: height * 0.08,
    alignItems: 'center',
    elevation: 6,
    bottom: 20,
    
  },
  button2: {
    backgroundColor: '#FFFFFF', // blu per i bottoni
    paddingVertical:15,
    borderRadius: 15,
    width: width * 0.46,
    height: height * 0.08,
    alignItems: 'center',
    elevation: 6,
    bottom: 20,
  },
  textButton: {
    color: '#FFFFFF', // Bianco per il testo nei bottoni
    fontSize: 22,
    fontWeight: 'bold',
  },
  textButton2: {
    color: '#007fbb', // Bianco per il testo nei bottoni
    fontSize: 22,
    fontWeight: 'bold',
  },
  header: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
  },
});
