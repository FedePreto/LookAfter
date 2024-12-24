import React, { useEffect, useState, useContext } from 'react';
import { StyleSheet, Text, View, Image, Alert, TouchableWithoutFeedback, TouchableOpacity, Animated } from 'react-native';
import HamburgerMenu from './HamBurgerMenu';
import * as Speech from 'expo-speech';
import { AudioContext } from './AudioProvider';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

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

  const textToRead = `'Congratulations! you reached me'`;

  if (!artwork) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Artwork details not found</Text>
      </View>
    );
  }

  const handleProceed = () => {
    navigation.navigate('ArtworkInformations', { artworkKey });
  };

  const handleReplayAudio = () => {
    Speech.stop();
    Speech.speak(textToRead); // Ripete l'audio
  };

  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    setActiveScreen('Path');

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();

    if (isAudioOn && activeScreen === 'Path') {
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
      setDropdownVisible(false); // Chiude il menu se è aperto
    }
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
          {/* Mappiamo ogni descrizione per renderizzarla separatamente */}
          {artwork.description.map((desc, index) => (
            <Text key={index} style={styles.description}>{desc}</Text>
          ))}
        </View>

        {/* Proceed Button */}
        <TouchableOpacity onPress={handleProceed} style={styles.proceedButton}>
          <Text style={styles.buttonText}>Get Info About Me</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F0FF',
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
    width: '110%',
    height: '100%',
    backgroundColor: '#007fbb', // Curved background color
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,

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
    // backgroundColor: '#54A8E8',
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
    borderColor: '#54A8E8',
    shadowColor: '#54A8E8',
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
    bottom: 80,
  },
  artworkTitle: {
    fontSize: 36, // H1: 32-40 px
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  description: {
    fontSize: 22, // H3: 20-24 px
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
  },
  proceedButton: {
    position: 'absolute',
    bottom: 50,
    right: 20,
    backgroundColor: '#007fbb',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
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
