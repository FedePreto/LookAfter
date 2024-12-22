import React, { useEffect, useState, useContext } from 'react';
import { 
  NavigationContainer 
} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { 
  Text, 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  Animated, 
  TouchableWithoutFeedback, 
  Vibration 
} from 'react-native';
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
  const [buttonAnim] = useState(new Animated.Value(1));
  const [positionAnim] = useState(new Animated.Value(0));

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
      setDropdownVisible(false);
    }
  };

  const handlePress = () => {
    Vibration.vibrate([100, 200, 100]);

    Animated.parallel([
      Animated.sequence([
        Animated.timing(positionAnim, {
          toValue: -10, // Move up
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(positionAnim, {
          toValue: 0, // Move back down
          duration: 100,
          useNativeDriver: true,
        }),
      ]),
      Animated.sequence([
        Animated.timing(buttonAnim, {
          toValue: 1.2, // Scale up
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(buttonAnim, {
          toValue: 1, // Scale down
          duration: 100,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      navigation.navigate('CameraScreen');
    });
  };

  return (
    <TouchableWithoutFeedback onPress={handleOutsidePress}>
      <View style={styles.container}>
        <View style={styles.header}>
          <HamburgerMenu navigation={navigation} isVisible={dropdownVisible} toggleDropdown={toggleDropdown} />
        </View>
        <Text style={styles.title}>Look After</Text>
        <Text style={styles.description}>
          FEEL THE SPACE OWN YOUR PATH
        </Text>
        <Animated.View
          style={{
            transform: [
              { scale: buttonAnim }, 
              { translateY: positionAnim }, 
            ],
          }}
        >
          <TouchableOpacity style={styles.button} onPress={handlePress}>
            <Text style={styles.buttonText}>Scan</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
  );
}

export default function App() {
  return (
    <AudioProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="MainPage" screenOptions={{ headerShown: false }}>
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
    backgroundColor: '#FFFFFF', // Main background color (white)
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
    color: '#007BFF', // Secondary color (blue)
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 32,
    color: '#007BFF', // Secondary color (blue)
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#FFFFFF', // Main color (white)
    borderWidth: 2,
    borderColor: '#007BFF', // Secondary color for the border
    paddingVertical: 25,
    paddingHorizontal: 60,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: '#007BFF', // Secondary color (blue)
    fontSize: 40,
    fontWeight: '700',
  },
});
