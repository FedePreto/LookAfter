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
import theme, { useCustomFonts } from './config/theme';
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
import CustomNavigationBar from './components/CustomNavigationBar.js';
import { SafeAreaView } from 'react-native-safe-area-context';
import CameraScreen3 from './components/Camera3.js'

const Stack = createStackNavigator();

function MainPage({ navigation }) {
  const fontsLoaded = useCustomFonts();

  const { isAudioOn, activeScreen, setActiveScreen } = useContext(AudioContext);
  const textToRead = "Ciao e benvenuto su Look After. Per favore, tocca il pulsante Inizia per procedere.";
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
    //Vibration.vibrate([100, 200, 100]);

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
      Speech.stop();
      navigation.navigate('CameraScreen');
    });
  };
  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Caricamento...</Text>
      </View>
    );
  }

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
        <Text style={styles.title}>Look After</Text>
        <TouchableOpacity style={styles.button} onPress={handlePress}>
            <Text style={styles.buttonText}>Inizia</Text>
          </TouchableOpacity>
        <Text style={styles.description}>
         VIVI LO SPAZIO,
        </Text>
        <Text style={styles.description}>
        PRENDI IN MANO IL TUO CAMMINO
        </Text>
        <Animated.View
          style={{
            transform: [
              { scale: buttonAnim }, 
              { translateY: positionAnim }, 
            ],
          }}
        >
          
        </Animated.View>
      </View>
      
    </TouchableWithoutFeedback>
  );
}

export default function App() {
  return (
    <SafeAreaView style={styles.safeArea}>
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
          <Stack.Screen name="CameraScreen3" component={CameraScreen3} />
          <Stack.Screen name="ChatScreen" component={ChatScreen} />
          <Stack.Screen name="RecordingScreen" component={RecordingScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </AudioProvider>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0055A4',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  loadingText: {
    fontSize: 24,
    color: theme.colors.textPrimary,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  header: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
  },
  title: {
    fontSize: 50,
    fontWeight: '800',
    fontFamily: theme.fonts.primary,
    color: theme.colors.textSecondary, 
    textAlign: 'center',
    marginBottom: 16,
    bottom: 40
  },
  description: {
    fontSize: 30,
    fontFamily: theme.fonts.primary,
    color: theme.colors.textSecondary, 
    textAlign: 'center',
    // marginBottom: 20,
    top:100
  },
  button: {
    backgroundColor: '#0055A4',
    borderWidth: 2,
    borderColor: '#0055A4',
    paddingVertical: 30, // Increase vertical padding for a taller button
    paddingHorizontal: 80, // Increase horizontal padding for a wider button
    borderRadius: 30, // Slightly bigger border radius for a rounder appearance
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 }, // Increased shadow offset for more prominence
    shadowOpacity: 0.5,
    shadowRadius: 6, // Larger shadow radius
    elevation: 12, // Increased elevation for a higher shadow effect
    alignItems: 'center',
  },
  
  buttonText: {
    fontFamily: theme.fonts.primary,
    color: 'white',
    fontSize: 40,
    fontWeight: '700',
  },
});
