import React, { useEffect, useState, useContext } from 'react';
import { StyleSheet, Text, View, Image, Alert, TouchableWithoutFeedback, TouchableOpacity, Animated } from 'react-native';
import HamburgerMenu from './HamBurgerMenu';
import * as Speech from 'expo-speech';
import { AudioContext } from './AudioProvider';
import { Ionicons } from '@expo/vector-icons';
import { Dimensions } from 'react-native';
import theme from '../config/theme';
import CustomNavigationBar from './CustomNavigationBar.js';
const { width, height } = Dimensions.get('window');


export default function PathDetails({ route, navigation }) {
  const { artworkKey } = route.params || {}; // Identifica quale opera gestire
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const { isAudioOn, setActiveScreen, activeScreen } = useContext(AudioContext); // Stato audio scelto dal menù

  const artworkDetails = {
    david: {
      name: 'David',
      image: require('../assets/david.png'),
      description: [
        'Congratulations! you reached me',
      ],
      nextScreen: 'ConfirmArtwork',
    },
    monalisa: {
      name: 'Mona Lisa',
      image: require('../assets/monalisa.png'),
      description: [
        'Congratulations! you reached me',
      ],
      nextScreen: 'ConfirmArtwork',
    },
  };

  const artwork = artworkDetails[artworkKey];

  const textToRead = "Congratulations! you reached me";

  if (!artwork) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Artwork details not found</Text>
      </View>
    );
  }

  const handleProceed = () => {
    Speech.stop();

    navigation.navigate('ArtworkInformations', { artworkKey });
  };

  const handleReplayAudio = () => {
    Speech.stop();
    Speech.speak(textToRead); // Ripete l'audio
  };

  const [fadeAnim] = useState(new Animated.Value(0));

   useEffect(() => {
      if (isAudioOn) {
        Speech.speak(textToRead); // Parla solo se isAudioOn è true
      }
      
      return () => {
        Speech.stop(); // Ferma la riproduzione quando si esce dalla schermata
      };
    }, [isAudioOn]);

    useEffect(() => {
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }).start();
      }, []);

  // useEffect(() => {
  //   setActiveScreen('Path');

  //   Animated.timing(fadeAnim, {
  //     toValue: 1,
  //     duration: 2000,
  //     useNativeDriver: true,
  //   }).start();

  //   if (isAudioOn && activeScreen === 'Path') {
  //     Speech.speak(textToRead);
  //   } else {
  //     Speech.stop();
  //   }

  //   return () => {
  //     Speech.stop();
  //   };
  // }, [textToRead, isAudioOn]);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleOutsidePress = () => {
    if (dropdownVisible) {
      setDropdownVisible(false); // Chiude il menu se è aperto
    }
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
          {/* Mappiamo ogni descrizione per renderizzarla separatamente */}
          {artwork.description.map((desc, index) => (
            <Text key={index} style={styles.description}>{desc}</Text>
          ))}
        </View>

        {/* Proceed Button */}
        <TouchableOpacity onPress={handleProceed} style={styles.proceedButton}>
          <Text style={styles.buttonText}>Get Info About Me</Text>
        </TouchableOpacity>
        
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
  container2: {
    top:0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
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
    bottom: 0,
  },
  description: {
    fontSize: 30, // H3: 20-24 px
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
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
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginTop: 50,
  },
});
