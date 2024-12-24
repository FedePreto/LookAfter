import React, { useEffect, useState, useContext } from 'react';
import { StyleSheet, Text, View, Image, TouchableWithoutFeedback, TouchableOpacity, Animated } from 'react-native';
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
        'Proceed straight for 2 steps to reach the iconic sculpture, the Mona Lisa.',
        'Turn right and take 1 step after reaching the Mona Lisa.',
      ],
      nextScreen: 'ConfirmArtwork',
    },
    monalisa: {
      name: 'Mona Lisa',
      image: require('../assets/monalisa.png'),
      description: [
        'Proceed straight for 2 steps to reach the iconic sculpture, the David.',
        'Turn right and take 1 step after reaching the David.',
      ],
      nextScreen: 'ConfirmArtwork',
    },
  };

  const artwork = artworkDetails[artworkKey];

  const textToRead = `This is the ${artwork?.name}. ${artwork?.description.join(' ')}`;

  if (!artwork) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Artwork details not found</Text>
      </View>
    );
  }

  const handleProceed = () => {
    navigation.navigate(artwork.nextScreen, { artworkKey }); // Passa l'artworkKey
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
          <View style={styles.directionContainer}>
            <Text style={styles.directionHeader}>Route Information</Text>
            {artwork.description.map((step, index) => (
              <View key={index} style={styles.stepContainer}>
                <View style={styles.stepIndicator}>
                  <Text style={styles.stepNumber}>{index + 1}</Text>
                </View>
                <Text style={styles.stepText}>{step}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Proceed Button */}
        <TouchableOpacity onPress={handleProceed} style={styles.proceedButton}>
          <Text style={styles.buttonText}>Proceed</Text>
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
    bottom: 100,
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
    marginBottom: 20,
    color: '#007fbb',
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  stepIndicator: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#007fbb',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  stepNumber: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  stepText: {
    fontSize: 20,
    color: '#555',
    flex: 1,
    flexWrap: 'wrap',
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
