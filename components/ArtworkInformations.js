import React, { useEffect, useState, useContext } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import { AudioContext } from './AudioProvider';
import HamburgerMenu from './HamBurgerMenu';

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
      name: 'David',
      image: require('../assets/david.png'),
      description: [
        "Hello, I am David, the masterpiece sculpted by the legendary Michelangelo between 1501 and 1504. I stand tall, a symbol of strength, courage, and youthful determination.",
        "I represent the biblical hero David, moments before his epic battle with Goliath. Notice the tension in my pose: my muscles are taut, my gaze focused and confident.",
        "Step closer and observe the intricate details: the veins running through my hands, the curve of my muscles, and the determination in my expression.",
        "I am David, a story of bravery, artistry, and the triumph of the human spirit.",
      ],
    },
  };

  const artwork = artworkMap[artworkKey];

  if (!artwork) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Artwork not found.</Text>
      </View>
    );
  }

  const textToRead = `This is the ${artwork.name}. ${artwork.description.join(' ')}`;

  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    setActiveScreen('ArtworkInformations'); // Imposta questa schermata come attiva

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

    return () => {
      Speech.stop();
    };
  }, [textToRead, isAudioOn, activeScreen]);

  const handleReplayAudio = () => {
    if (!isAudioOn && activeScreen === 'ArtworkInformations') { 
      setIsAudioOn(true);
    } 
    Speech.stop();
    Speech.speak(textToRead);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Image Section */}
        <View style={styles.imageContainer}>
          {/* Hamburger Menu */}
          <View style={styles.hamburgerMenuContainer}>
            <HamburgerMenu navigation={navigation} isVisible={dropdownVisible} />
          </View>
          {/* Artwork Image */}
          <Image source={artwork.image} style={styles.artworkImage} />
          <TouchableOpacity onPress={handleReplayAudio} style={styles.audioButton}>
            <Ionicons name="volume-high-outline" size={30} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Title */}
        <Text style={styles.title}>{artwork.name}</Text>

        {/* Description */}
        {artwork.description.map((paragraph, index) => (
          <Animated.Text key={index} style={[styles.description, { opacity: fadeAnim }]}>
            {paragraph}
          </Animated.Text>
        ))}
      </ScrollView>

      {/* Chat Button */}
      <TouchableOpacity
        style={styles.chatButton}
        onPress={() => navigation.navigate('ChatScreen', { artworkKey })}
      >
        <Ionicons name="chatbubble-outline" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 120, // Spazio extra per evitare copertura del pulsante
    alignItems: 'center',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  hamburgerMenuContainer: {
    position: 'absolute',
    top: 10,
    left: 210,
    zIndex: 10, // Porta il menu sopra l'immagine
  },
  artworkImage: {
    width: 250,
    height: 300,
    resizeMode: 'contain',
    borderWidth: 2,
    borderColor: '#333',
  },
  audioButton: {
    position: 'absolute',
    bottom: -10,
    right: 10,
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 50,
    elevation: 5,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  description: {
    fontSize: 30,
    color: '#555',
    lineHeight: 30,
    textAlign: 'justify',
    marginBottom: 15,
  },
  chatButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#d32f2f',
    padding: 15,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});
