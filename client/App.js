import React, { useEffect, useState, useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Text, View, StyleSheet, TouchableOpacity, Animated , TouchableWithoutFeedback} from 'react-native';
import CameraScreen from './components/CameraScreen.js'; 
import PreviewScreen from './components/PreviewScreen.js';
import Panoramica from './components/Panoramic.js';
import ChooseArtworkScreen from './components/ArtworkScreenDavid.js';
import PathDetails from './components/Path.js';
import ConfirmArtwork from './components/ArrivalConfirmation.js';
import CameraConfirmation from './components/CameraConfirmation.js';
import PreviewConfirmation from './components/PreviewConfirmation.js';
import ArtworkReached from './components/ArtworkReached.js';
import ArtworkInformations from './components/ArtworkInformations.js';
import AnotherArtworkReached from './components/AnotherArtworkReached.js';
import ArtworkInformationsBalloon from './components/ArtworkInformationsBalloon.js';
import LostPage from './components/LostPage.js';
import ChatScreen from './components/ChatScreen.js';
import RecordingScreen from './components/RecordingScreen.js';
import { AudioProvider } from './components/AudioProvider.js';
import { AudioContext } from './components/AudioProvider.js';
import * as Speech from 'expo-speech';
import HamburgerMenu from './components/HamBurgerMenu.js';

const Stack = createStackNavigator();

function MainPage({ navigation }) {
  const { isAudioOn, setActiveScreen, activeScreen } = useContext(AudioContext);
  const textToRead = `Hello and welcome to Look After. Please touch the Scan button to proceed.`;
  const [fadeAnim] = useState(new Animated.Value(0));
  const [dropdownVisible, setDropdownVisible] = useState(false);
  

  useEffect(() => {
    setActiveScreen('App');

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();

    if (isAudioOn && activeScreen === 'App') {
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
      setDropdownVisible(false); // Close the menu if it's open
    }
  };

  return (
    <TouchableWithoutFeedback onPress={handleOutsidePress}>
    <View style={styles.container}>
      <View style={styles.header}>
        <HamburgerMenu navigation={navigation} isVisible={dropdownVisible} toggleDropdown={toggleDropdown}/>
      </View>
      <Text style={styles.title}>Look After</Text>
      <Text style={styles.description}>
        FEEL THE SPACE OWN YOUR PATH
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('CameraScreen')}
      >
        <Text style={styles.buttonText}>Scan</Text>
      </TouchableOpacity>
    </View>
    </TouchableWithoutFeedback>
  );
}

export default function App() {
  return (
    <AudioProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="MainPage"  screenOptions={{headerShown: false}}>
          <Stack.Screen name="MainPage" component={MainPage} options={{ title: 'Main Page' }} />
          <Stack.Screen name="CameraScreen" component={CameraScreen} options={{ title: 'Camera' }} />
          <Stack.Screen name="Preview" component={PreviewScreen} />
          <Stack.Screen name="ChooseArtwork" component={ChooseArtworkScreen} />
          <Stack.Screen name="PathDetails" component={PathDetails} />
          <Stack.Screen name="ConfirmArtwork" component={ConfirmArtwork} />
          <Stack.Screen name="CameraConfirmation" component={CameraConfirmation} />
          <Stack.Screen name="PreviewConfirmation" component={PreviewConfirmation} />
          <Stack.Screen name="ArtworkReached" component={ArtworkReached} />
          <Stack.Screen name="ArtworkInformations" component={ArtworkInformations} />
          <Stack.Screen name="AnotherArtworkReached" component={AnotherArtworkReached} />
          <Stack.Screen name="ArtworkInformationsBalloon" component={ArtworkInformationsBalloon} />
          <Stack.Screen name="LostPage" component={LostPage} />
          <Stack.Screen name="ChatScreen" component={ChatScreen} />
          <Stack.Screen name="RecordingScreen" component={RecordingScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </AudioProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E8F0FF', // Light and modern background color
    position: 'relative',
    padding: 16,
  },
  header: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
  },
  title: {
    fontSize: 46,
    fontWeight: '800',
    color: '#2C3E50',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 16,
    textShadowColor: '2C3E50', // Black shadow for depth
    textShadowOffset: { width: 2, height: 2 }, // Offset the shadow
    textShadowRadius: 4,
    bottom: 30, 
  },
  description: {
    fontSize: 32, // Increased size for readability
    color: '#2C3E50', // Dark blue for better contrast
    fontWeight: '600', // Medium bold for emphasis
    textAlign: 'center', // Center alignment for focus
    marginBottom: 20, // Space below the description
    lineHeight: 32, // Proper spacing for multi-line text
    letterSpacing: 1.2, // Slight letter spacing for a modern feel
    paddingHorizontal: 16, // Padding for better alignment on smaller screens
    backgroundColor: '#E8F0FF', // Subtle background to separate from other elements
    borderRadius: 10, // Rounded corners for aesthetics
    shadowColor: '#000', // Shadow for better visibility
    shadowOffset: { width: 0, height: 4 }, // Shadow positioning
    shadowOpacity: 0.1, // Subtle shadow opacity
    shadowRadius: 6, // Padding for better alignment on smaller screen
  },
  button: {
    backgroundColor: '#007BFF', // Vibrant blue for CTA buttons
    paddingVertical: 25,
    paddingHorizontal: 60,
    borderRadius: 25, // Fully rounded corners for a modern look
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5, 
    top:50,
  },
  buttonText: {
    color: '#FFF', // White text for good contrast
    fontSize: 40,
    fontWeight: '700',
    textAlign: 'center',
  },
  hamburgerMenu: {
    backgroundColor: '#FFF',
    padding: 12,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  dropdown: {
    position: 'absolute',
    top: 60,
    right: 10,
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1000,
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F1F1',
  },
  dropdownText: {
    fontSize: 16,
    color: '#333',
  },
  fadeInAnimation: {
    opacity: 1, // Used for fade-in animation
    transition: 'opacity 0.5s ease-in-out',
  },
});

