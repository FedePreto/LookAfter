import React, { useState, useEffect, useContext, useCallback} from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Animated,TouchableWithoutFeedback } from 'react-native';
import { Dimensions } from 'react-native';
import CustomNavigationBar from './CustomNavigationBar.js';
import theme ,{useCustomFonts}from '../config/theme';
import { AudioContext } from './AudioProvider';
import * as Speech from 'expo-speech';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

export default function AnotherArtworkReached({ navigation, route }) {
  const fontsLoaded = useCustomFonts();
  const { artworkKey } = route.params;
  const [fadeAnim] = useState(new Animated.Value(0));
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const textToRead = `Non hai raggiunto David, ma hai invece raggiunto me: Sono la Balloon Girl! Ora hai due opzioni: posso riportarti dal David oppure darti informazioni su di me.`;
  
  const artworkDetails = {
    monalisa: {
      name: 'La Monalisa',
      image: require('../assets/monalisa.png'),
      nextScreen: 'CameraConfirmation',
    },
    david: {
      name: 'Il David',
      image: require('../assets/david.png'),
      nextScreen: 'CameraConfirmation',
    },
  };
  const artwork = artworkDetails[artworkKey];
    const { isAudioOn, setActiveScreen } = useContext(AudioContext); 

  useFocusEffect(
        useCallback(() => {
          setActiveScreen('AnotherArtworkReached'); // Update the active screen
          
          if (fontsLoaded && isAudioOn) {
            Speech.stop(); // Stop any ongoing speech
            
            setTimeout(() => {
              console.log("Speaking:", textToRead); // Debugging: Check if this runs
              
              Speech.speak(textToRead, {
                language: 'it-IT', // Ensure Italian is selected if needed
                pitch: 1.0, // Normal pitch
                rate: 0.9, // Adjust speed if needed
                onStart: () => console.log("Speech started"),
                onDone: () => console.log("Speech finished"),
                onError: (error) => console.error("Speech error:", error),
              });
            }, 500); // Delay to ensure smooth playback
          }
      
          return () => {
            Speech.stop(); // Stop speech when leaving the screen
          };
        }, [fontsLoaded, isAudioOn, textToRead])
      ); 
  
      useEffect(() => {
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }).start();
        }, []);
  const handleProceed = () => {
    
    // navigation.navigate('ArtworkInformationsBalloon');
    Speech.stop();
    navigation.navigate('ArtworkInformations', {artworkKey: 'ballon_girl'});
  };
  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleProceedMonalisa = () => {
    Speech.stop();
    navigation.navigate('PathDetails',{artworkKey});
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
                onReplayAudio={() => Speech.speak(textToRead, {
                                        language: 'it-IT', // Ensure Italian is selected if needed
                                        pitch: 1.0, // Normal pitch
                                        rate: 0.9, // Adjust speed if needed
                                        onStart: () => console.log("Speech started"),
                                        onDone: () => console.log("Speech finished"),
                                        onError: (error) => console.error("Speech error:", error),
                                      })}
                />
      {/* Header Section */}
      <View style={styles.header}>
        <Image
          source={require('../assets/ballon.jpg')}
          style={styles.headerImage}
          resizeMode="contain"
        />
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <View style={styles.directionContainer}>
          <Text style={styles.directionHeader}>Hai raggiunto Baloon Girl</Text>
          <Text style={styles.description}>
          Non hai raggiunto {artwork.name}, ma ti trovi di fronte a me, La Ballon Girl di Bansky!
        </Text>
        </View>
        
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleProceedMonalisa} style={styles.buttonLeft}>
          <Text style={styles.buttonText2 } numberOfLines={2} >Portami da {artwork.name}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleProceed} style={styles.buttonRight}>
          <Text style={styles.buttonText} numberOfLines={2} >Conoscimi meglio</Text>
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
  description: {
    fontSize: 24,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  header: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    
  },
  headerImage: {
    width: 300,
    height: 300,
    top: 100,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    bottom:10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: width,
    padding: 0,
    position: 'absolute',
    bottom: 10,
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
    marginBottom: 10,
    color: '#0055A4',
  },
  buttonLeft: {
    backgroundColor: '#FFFFFF', // blu per i bottoni
    paddingVertical:15,
    borderRadius: 15,
    width: width * 0.46,
    height: height * 0.08,
    alignItems: 'center',
    elevation: 6,
    bottom: 20,
  },
  buttonRight: {
    backgroundColor: '#0055A4', // blu per i bottoni
    paddingVertical:15,
    borderRadius: 15,
    width: width * 0.46,
    height: height * 0.08,
    alignItems: 'center',
    elevation: 6,
    bottom: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center', // Ensures text stays centered
    flexWrap: 'wrap', // Allows text to wrap inside the button
    top:2,
},
buttonText2: {
    color: '#0055A4',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    flexWrap: 'wrap',
    top:2,
},

});