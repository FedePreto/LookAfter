import React, { useEffect, useState, useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Text, View, StyleSheet, TouchableOpacity, Animated } from 'react-native';
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <HamburgerMenu navigation={navigation} isVisible={dropdownVisible} />
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
  );
}

export default function App() {
  return (
    <AudioProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="MainPage">
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
    backgroundColor: '#f0f0f0',
    position: 'relative', // Necessario per posizionamenti assoluti dei figli
  },
  header: {
    position: 'absolute',
    top: 20, // Distanza dal bordo superiore
    right: 20, // Distanza dal bordo destro
    zIndex: 10, // Porta il menu sopra gli altri elementi
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#6200ee',
    padding: 15,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 18,
    color: '#333',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
});
