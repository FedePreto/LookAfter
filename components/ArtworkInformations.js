import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';

export default function ArtworkInformations({ navigation, route }) {
  const { artworkKey } = route.params;

  // Mappa delle informazioni delle opere d'arte
  const artworkMap = {
    monalisa: {
      name: 'Mona Lisa',
      image: require('../assets/monalisa.png'),
      description: [
        'I am Mona Lisa, painted by the master Leonardo da Vinci...',
        'Leonardo captured me with soft brushstrokes, blending light and shadow...',
        'I sit here, composed and still, a reflection of the Renaissance...',
      ],
    },
    david: {
      name: 'David',
      image: require('../assets/david.png'),
      description: [
        'I am David, sculpted by Michelangelo...',
        'Standing 17 feet tall, I represent the biblical hero...',
        'Michelangelo captured the tension in my pose...',
      ],
    },
  };

  // Ottieni i dati dell'opera d'arte corrispondente alla chiave
  const artwork = artworkMap[artworkKey];

  if (!artwork) {
    return (
        <View style={styles.container}>
          <Text style={styles.errorText}>Artwork not found.</Text>
        </View>
    );
  }

  const textToRead = `This is the ${artwork.name}. ${artwork.description.join(' ')}`;

  const [fadeAnim] = useState(new Animated.Value(0)); // Animazione per il testo

  useEffect(() => {
    // Esegui l'animazione di apparizione del testo
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();

    // Avvia l'audio quando la schermata è caricata
    Speech.speak(textToRead);

    return () => {
      Speech.stop(); // Ferma l'audio quando si lascia la schermata
    };
  }, [textToRead]);

  const handleReplayAudio = () => {
    Speech.stop();
    Speech.speak(textToRead); // Riascolta l'audio
  };

  return (
      <View style={styles.container}>
        {/* Header Section */}
        <View style={styles.header}>
          <Image
              source={artwork.image} // Usa l'immagine specifica dell'opera
              style={styles.headerImage}
          />
          <Text style={styles.title}>{artwork.name}</Text>
          <TouchableOpacity onPress={handleReplayAudio} style={styles.audioButton}>
            <Ionicons name="volume-high-outline" size={24} color="white" />
          </TouchableOpacity>
          <Ionicons name="mic" size={30} color="#4CAF50" style={styles.micIcon} />
        </View>

        {/* Main Content - Scrollable */}
        <ScrollView style={styles.scrollContent}>
          {artwork.description.map((paragraph, index) => (
              <Animated.Text key={index} style={[styles.description, { opacity: fadeAnim }]}>
                {paragraph}
              </Animated.Text>
          ))}
        </ScrollView>

        {/* Chat Button */}
        <TouchableOpacity style={styles.chatButton} onPress={() => navigation.navigate('ChatScreen', { artworkKey })}>
          <Ionicons name="chatbubble-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#ffffff',
    elevation: 2,
  },
  headerImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginRight: 20,
    borderWidth: 3,
    borderColor: '#ddd',
  },
  title: {
    flex: 1,
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  audioButton: {
    padding: 10,
    backgroundColor: '#4CAF50',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    flex: 1,
    padding: 20,
  },
  description: {
    fontSize: 18,
    color: '#555',
    marginBottom: 15,
    lineHeight: 24,
    textAlign: 'justify',
  },
  chatButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#d32f2f',
    padding: 15,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  micIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});