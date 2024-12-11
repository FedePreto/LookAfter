import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';

export default function ChooseArtworkScreen({ route, navigation }) {

  const handleNext = () => {
    navigation.navigate('ChooseArtworkMonalisa');
  };

  const handleChoose = () => {
    navigation.navigate('PathDavid');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose the Artwork</Text>
      <Image
        source={require('../assets/david.png')} // Replace with actual image URI
        style={styles.headerImage}
      />

      {/* Artwork Title */}
      <Text style={styles.artworkTitle}>Title: The David</Text>

      {/* Choose Button */}
      <TouchableOpacity onPress={handleChoose} style={styles.chooseButton}>
        <Text style={styles.chooseButtonText}>Choose</Text>
      </TouchableOpacity>

      {/* Next Button Always Fixed on the Bottom Right */}
      
        <TouchableOpacity onPress={handleNext} style={styles.nextButton}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
    
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  headerImage: {
    width: 300,
    height: 400,
    marginBottom: 20,
  },
  artworkTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  chooseButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 10,
    width: 150,
    alignItems: 'center',
    marginBottom: 30, // Spacing from other elements
  },
  chooseButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  nextButton: {
    position: 'absolute',
    bottom: 30,
    right: 20, // Always align "Next" button on the right
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 10,
    width: 120,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});