import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';

export default function PathDetails({ route, navigation }) {
  const { artworkKey } = route.params || {}; // Identifica quale opera gestire
  const artworkDetails = {
    david: {
      image: require('../assets/david.png'),
      description1: '2 FOOTS FORWARD TO REACH THE MOST ICONIC SCULPTURE "THE MONALISA"',
      description2: '1 FOOT ON THE RIGHT ONCE "THE MONALISA" HAS BEEN REACHED',
      nextScreen: 'ConfirmArtwork',
    },
    monalisa: {
      image: require('../assets/monalisa.png'),
      description1: '2 FOOTS FORWARD TO REACH THE MOST ICONIC SCULPTURE "THE DAVID"',
      description2: '1 FOOT ON THE RIGHT ONCE "THE DAVID" HAS BEEN REACHED',
      nextScreen: 'ConfirmArtwork',
    },
  };

  const artwork = artworkDetails[artworkKey];

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

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Image source={artwork.image} style={styles.headerImage} />
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

      {/* Main Content */}
      <View style={styles.content}>
        <Text style={styles.description}>{artwork.description1}</Text>
        <Text style={styles.description}>{artwork.description2}</Text>
      </View>

      {/* Process Button */}
      <TouchableOpacity onPress={handleProceed} style={styles.proceedButton}>
        <Text style={styles.buttonText}>Proceed</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  description: {
    fontSize: 30,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
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
