import React, {useState, useContext, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, TouchableWithoutFeedback, Animated} from 'react-native';
import HamburgerMenu from './HamBurgerMenu';
import { AudioContext } from './AudioProvider';
import * as Speech from 'expo-speech';

export default function PreviewScreen({ route, navigation }) {
  const { images } = route.params || {}; // Receive images array from CameraScreen
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

  const __toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const __retakePicture = () => {
    navigation.goBack(); // Go back to CameraScreen
  };

  const __chooseArtwork = () => {
    navigation.navigate('ChooseArtwork', { artworkKey: 'david' }); // Navigate to ChooseArtworkScreen
  };
  
  const isMultipleImages = Array.isArray(images);

  return (
    <TouchableWithoutFeedback
      onPress={() => {
       if (dropdownVisible) __closeDropdown();
      }}
    >
    
    <View style={styles.container}>
      <View style={styles.header}>
      <HamburgerMenu navigation={navigation} onCloseDropdown={__closeDropdown} isVisible = {dropdownVisible}/>
      </View>
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
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
    marginTop: 20,
  },
  header: {
    position: 'absolute',
    top: 10,
    right: 10, // Align to the top-right corner
    zIndex: 10, // Ensure it's above other elements
  },
  menuButton: {
    top: 0,
    right:0,
    padding: 10,
  },
  imageContainer: {
    flexDirection: 'row', // Arrange images horizontally
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 0,
  },
  imageWrapper: {
    width: 300, // Match image width for paging
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -20 ,
  },
  image: {
    width: 350,
    height: 250,
    marginHorizontal: 10,
    borderRadius: 10,
    marginTop: -200,
  },
  noImagesText: {
    fontSize: 18,
    color: 'gray',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    position: 'absolute',
    bottom: 100,
  },
  button: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 10,
    width: 120,
    alignItems: 'center',
  },
  textButton: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
});
