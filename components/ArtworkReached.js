import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function ArtworkReached({ navigation }) {
  const route = useRoute(); // Ottieni il route
  const { artworkKey } = route.params || {}; // Estrai artworkKey dai parametri

  const handleProceed = () => {
    navigation.navigate('ArtworkInformations', { artworkKey });
  };

  // Mappa delle immagini in base a artworkKey
  const images = {
    monaLisa: require('../assets/monalisa.png'),
    david: require('../assets/david.png'),
  };

  // Seleziona l'immagine corretta o un'immagine predefinita
  const artworkImage = images[artworkKey] ;

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Image
          source={artworkImage} // Usa l'immagine selezionata
          style={styles.headerImage}
        />
      </View>
      
      {/* Main Content */}
      <View style={styles.content}>
        <Text style={styles.description}>
          Congratulations, you reached me!
        </Text>
      </View>

      {/* Process button */}
      <TouchableOpacity onPress={handleProceed} style={styles.proceedButton}>
        <Text style={styles.buttonText}>Get Info about me</Text>
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
    textAlign: 'center', // Center-align the text horizontally
    marginBottom: 20, // Adds space above the button
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
    resizeMode: 'contain', // Assicura che l'immagine sia proporzionata
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
});
