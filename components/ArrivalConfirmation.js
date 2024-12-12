import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';

const artworkDetails = {
  monalisa: {
    image: require('../assets/monalisa.png'),
    nextScreen: 'CameraConfirmation',
  },
  david: {
    image: require('../assets/david.png'),
    nextScreen: 'CameraConfirmation',
  },
};

export default function ConfirmArtwork({ route, navigation }) {
  const { artworkKey } = route.params || {}; // artworkKey per distinguere l'opera
  const artwork = artworkDetails[artworkKey];

  if (!artwork) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Artwork not found</Text>
      </View>
    );
  }

  const handleProceed = () => {
    navigation.navigate(artwork.nextScreen, { artworkKey });
  };

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Image source={artwork.image} style={styles.headerImage} />
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <Text style={styles.description}>
          To confirm that you have arrived to me please take a picture of me!
        </Text>
      </View>

      {/* Proceed Button */}
      <TouchableOpacity onPress={handleProceed} style={styles.proceedButton}>
        <Text style={styles.buttonText}>Take Picture</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 40,
  },
  description: {
    fontSize: 30,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  header: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
  },
  headerImage: {
    width: 300,
    height: 300,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  proceedButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#d32f2f',
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
