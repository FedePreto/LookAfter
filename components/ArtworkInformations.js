import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ArtworkInformations({ navigation, route }) {
  const { artworkKey } = route.params; // Ricevi l'artworkKey come parametro

  // Mappa delle informazioni delle opere d'arte
  const artworkMap = {
    monalisa: {
      name: 'Mona Lisa',
      image: require('../assets/monalisa.png'),
      icons: [
        'https://via.placeholder.com/30',
        'https://via.placeholder.com/30',
      ],
      description: [
        'I am Mona Lisa, painted by the master Leonardo da Vinci in the early 16th century...',
        'Leonardo captured me with soft brushstrokes, blending light and shadow...',
        'I sit here, composed and still, a reflection of the Renaissance ideals of beauty...',
        'I have watched centuries unfold from my frame, carried from Florence to France...',
      ],
    },
    david: {
      name: 'David',
      image: require('../assets/david.png'),
      icons: [
        'https://via.placeholder.com/30',
        'https://via.placeholder.com/30',
      ],
      description: [
        'I am David, sculpted by Michelangelo between 1501 and 1504...',
        'Standing 17 feet tall, I represent the biblical hero, confident and ready to face Goliath...',
        'Michelangelo captured the tension in my pose, the veins in my hands, the furrow in my brow...',
        'I am a symbol of strength and youthful beauty, an icon of the Renaissance period...',
      ],
    },
  };

  // Ottieni i dati dell'opera d'arte corrispondente alla chiave
  const artwork = artworkMap[artworkKey];

  if (!artwork) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>
          Artwork not found.
        </Text>
      </View>
    );
  }

  const handleChatOpen = () => {
    console.log(`Chat button pressed for ${artwork.name}`);
  };

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Image
          source={artwork.image} // Usa l'immagine specifica dell'opera
          style={styles.headerImage}
        />
        <View style={styles.headerIcons}>
          {artwork.icons.map((iconUri, index) => (
            <Image
              key={index}
              source={{ uri: iconUri }}
              style={styles.icon}
            />
          ))}
        </View>
      </View>

      {/* Main Content - Scrollable */}
      <ScrollView style={styles.scrollContent}>
        {artwork.description.map((paragraph, index) => (
          <Text key={index} style={styles.description}>
            {paragraph}
          </Text>
        ))}
      </ScrollView>

      {/* Chat Button */}
      <TouchableOpacity onPress={handleChatOpen} style={styles.chatButton}>
        <Ionicons name="chatbubble-outline" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f8f8', // Optional background color for the header
  },
  headerImage: {
    width: 70,
    height: 70,
  },
  headerIcons: {
    flexDirection: 'row',
  },
  icon: {
    width: 30,
    height: 30,
    marginLeft: 10,
  },
  scrollContent: {
    flex: 1,
    paddingHorizontal: 20,
    marginBottom: 80, // Adds space to avoid overlap with the button
  },
  description: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  chatButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#d32f2f',
    padding: 15,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});
