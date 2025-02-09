import React, { useEffect, useState, useContext } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, TouchableWithoutFeedback, ScrollView, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import { AudioContext } from './AudioProvider';
import HamburgerMenu from './HamBurgerMenu';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomNavigationBar from './CustomNavigationBar.js';
import theme from '../config/theme';

export default function ArtworkInformations({ navigation, route }) {
  const { artworkKey } = route.params;
  const { isAudioOn, setIsAudioOn, setActiveScreen, activeScreen } = useContext(AudioContext);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const artworkMap = {
    monalisa: {
      name: 'Mona Lisa',
      image: require('../assets/monalisa.png'),
      description: [
        "Greetings, I am the Mona Lisa, also known as La Gioconda. I was painted by the brilliant Leonardo da Vinci between 1503 and 1506, during the golden age of the Italian Renaissance.",
        "I am famous for my mysterious smile, a smile that has baffled and intrigued viewers for centuries. Look closely, and you’ll notice how it changes depending on the angle and your perception.",
        "Observe my eyes. Wherever you go, they seem to follow you, a result of Leonardo’s brilliant understanding of perspective and anatomy. My gaze captures you, inviting you into my timeless world.",
        "Today, I reside in the Louvre Museum in Paris. Millions journey from every corner of the world just to stand before me.",
      ],
    },
    david: {
      name: 'The David',
      image: require('../assets/david.png'),
      description: [
        "Hello, I am David, the masterpiece sculpted by the legendary Michelangelo between 1501 and 1504. I stand tall, a symbol of strength, courage, and youthful determination.",
        "I represent the biblical hero David, moments before his epic battle with Goliath. Notice the tension in my pose: my muscles are taut, my gaze focused and confident.",
        "Step closer and observe the intricate details: the veins running through my hands, the curve of my muscles, and the determination in my expression.",
        "I am David, a story of bravery, artistry, and the triumph of the human spirit.",
      ],
    },
    ballon_girl:{
      name: 'Balloon girl',
      image: require('../assets/balloon.png'),
      description: [
        "A vibrant image of a young girl standing in an open field, holding a brightly colored balloon.",
        "The balloon, a bold red or yellow, contrasts beautifully with the soft hues of a clear blue sky.",
        "The girl, dressed in a simple yet charming outfit, gazes upward with a look of wonder and joy. ",
        " Her hair flows gently in the breeze, and the overall scene radiates a sense of innocence and freedom.",
      ],
    }
  };

  const artwork = artworkMap[artworkKey];

  if (!artwork) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Artwork not found.</Text>
      </View>
    );
  }

  const textToRead = `${artwork.description.join(' ')}`;

  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    setActiveScreen('ArtworkInformations');

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();

    if (isAudioOn && activeScreen === 'ArtworkInformations') {
      Speech.speak(textToRead);
    } else {
      Speech.stop();
    }

    const unsubscribe = navigation.addListener('blur', () => {
      Speech.stop(); // Stop speech when the screen is no longer in focus
    });

    return () => {
      Speech.stop();
      unsubscribe();
    };
  }, [textToRead, isAudioOn, activeScreen]);

  const handleReplayAudio = () => {
    if (!isAudioOn && activeScreen === 'ArtworkInformations') {
      setIsAudioOn(true);
    }
    Speech.stop();
    Speech.speak(textToRead);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleOutsidePress = () => {
    if (dropdownVisible) {
      setDropdownVisible(false);
    }
  };

  return (
    // <TouchableWithoutFeedback onPress={handleOutsidePress} accessible = {true}>
    // <TouchableWithoutFeedback onPress={handleOutsidePress} accessible={false}>
      <View style={styles.container}>
        <CustomNavigationBar
                navigation={navigation}
                isVisible={dropdownVisible} 
                toggleDropdown={toggleDropdown}
                showBackButton={false}
                showAudioButton={true}
                onReplayAudio={() => Speech.speak(textToRead)}
                showNextArtwork = {true} 
                />
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={true}>
          {/* Header */}
          {/* <View style={styles.header}> */}
            {/* Pulsante "Other Artworks" */}
            {/* <TouchableOpacity
              onPress={() => navigation.navigate('ChooseArtwork', { artworkKey: 'david' })}
              style={styles.otherArtworksButton}>
              <Text style={styles.otherArtworksText}>Other Artworks</Text>
            </TouchableOpacity>
            
            {/* Menu Hamburger */}
            {/* <View style={styles.hamburgerMenuContainer}>
              <HamburgerMenu
                navigation={navigation}
                isVisible={dropdownVisible}
                toggleDropdown={toggleDropdown}
              />
            </View> */} 
            
          {/* </View> */}

          {/* Artwork Image */}
          <View style={styles.imageContainer}>
            <Image source={artwork.image} style={styles.artworkImage} />
            {/*<TouchableOpacity onPress={handleReplayAudio} style={styles.audioButton}>
              <Ionicons name="volume-high-outline" size={40} color="white" />
            </TouchableOpacity>*/}
          </View>

          {/* Title and Description */}
          <Text style={styles.title}>{artwork.name}</Text>
          {artwork.description.map((paragraph, index) => (
            <Animated.Text key={index} style={[styles.description, { opacity: fadeAnim }]}>
              {paragraph}
            </Animated.Text>
          ))}
        </ScrollView>

        {/* Chat Button */}
        <TouchableOpacity
          style={styles.chatButton}
          onPress={() => navigation.navigate('ChatScreen', { artworkKey })}>
          <Ionicons name="chatbubble-outline" size={40} color="white" />
        </TouchableOpacity>
      </View>
    //  </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    flexGrow:1,
    padding: 20,
    top: 50,
  },
  // header: {
  //   flex: 1,
  //   backgroundColor: theme.colors.background,
  //   alignItems: 'center',
  //   justifyContent: 'center',
  // },
  hamburgerMenuContainer: {
    position: 'absolute',
    right: 10, // Posiziona il menu a destra
    backgroundColor: '#007fbb',
  },
  otherArtworksButton: {
    backgroundColor: '#007fbb',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  otherArtworksText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  artworkImage: {
    width: 300,
    height: 350,
    resizeMode: 'contain',
    borderRadius: 10,
  },
  audioButton: {
    position: 'absolute',
    bottom: -20,
    right: 20,
    backgroundColor: '#007fbb',
    padding: 15,
    borderRadius: 50,
    elevation: 5,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginBottom: 20,
  },
  description: {
    fontSize: 30,
    color: '#555',
    lineHeight: 28,
    textAlign: 'left',
    marginBottom: 15,
    paddingHorizontal: 10, 
  },
  chatButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#007fbb',
    padding: 15,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  errorText: {
    fontSize: 20,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});
