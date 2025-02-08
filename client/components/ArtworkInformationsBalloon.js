import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ArtworkInformationsBalloon({ navigation, route }) {
  const { artworkKey } = route.params;
  const handleChatOpen = () => {
    // Logic to open chat can be added here
    console.log('Chat button pressed');
  };

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Image
          source={require('../assets/balloon.png')} // Replace with actual image URI
          style={styles.headerImage}
        />
        <View style={styles.headerIcons}>
          <Image
            source={{ uri: 'https://via.placeholder.com/30' }} // Replace with actual icon URI
            style={styles.icon}
          />
          <Image
            source={{ uri: 'https://via.placeholder.com/30' }} // Replace with actual icon URI
            style={styles.icon}
          />
        </View>
      </View>

      {/* Main Content - Scrollable */}
      <ScrollView style={styles.scrollContent}>
        <Text style={styles.description}>
          I am Mona Lisa, painted by the master Leonardo da Vinci in the early 16th century. My face, serene and enigmatic, has sparked endless curiosity. They call my smile mysterious and soft, almost teasing, as if I hold a secret untold.
        </Text>
        <Text style={styles.description}>
          Leonardo captured me with soft brushstrokes, blending light and shadow in a technique they call sfumato. Look closely at my eyes—they seem to follow you, alive with quiet intensity. The background behind me, a dreamy, distant landscape, suggests both timelessness and mystery.
        </Text>
        <Text style={styles.description}>
          I sit here, composed and still, a reflection of the Renaissance ideals of beauty and intellect. My hands rest gently, symbolizing poise, while the lack of visible jewelry or adornment keeps the focus on my face, my expression.
        </Text>
        <Text style={styles.description}>
          I have watched centuries unfold from my frame, carried from Florence to France, now dwelling in the Louvre. I am no longer just a portrait but a symbol of art’s enduring power to intrigue and inspire. What do you see in me?
        </Text>
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
    fontSize: 30,
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
});
