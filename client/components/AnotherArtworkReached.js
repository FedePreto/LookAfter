import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function AnotherArtworkReached({ navigation, route }) {
  const { artworkKey } = route.params;
  const handleProceed = () => {
    
    // navigation.navigate('ArtworkInformationsBalloon');
    navigation.navigate('ArtworkInformations', {artworkKey: 'ballon_girl'});
  };

  const handleProceedMonalisa = () => {
    navigation.navigate('PathDetails',{artworkKey});
  };

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Image
          source={require('../assets/balloon.png')}
          style={styles.headerImage}
        />
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <Text style={styles.description}>
          You didn't reach {artworkKey}, but you reached balloon girl instead!
        </Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleProceedMonalisa} style={styles.buttonLeft}>
          <Text style={styles.buttonText2}>Bring me to {artworkKey}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleProceed} style={styles.buttonRight}>
          <Text style={styles.buttonText}>Get Info about Balloon Girl</Text>
        </TouchableOpacity>
      </View>
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
    justifyContent: 'center',
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: width,
    padding: 0,
    position: 'absolute',
    bottom: 10,
  },
  buttonLeft: {
    backgroundColor: '#FFFFFF', // blu per i bottoni
    paddingVertical:15,
    borderRadius: 15,
    width: width * 0.46,
    height: height * 0.08,
    alignItems: 'center',
    elevation: 6,
    bottom: 20,
  },
  buttonRight: {
    backgroundColor: '#007fbb', // blu per i bottoni
    paddingVertical:15,
    borderRadius: 15,
    width: width * 0.46,
    height: height * 0.08,
    alignItems: 'center',
    elevation: 6,
    bottom: 20,
  },
  buttonText: {
    color: '#FFFFFF', // Bianco per il testo nei bottoni
    fontSize: 13,
    fontWeight: 'bold',
  },
  buttonText2: {
    color: '#007fbb', // Bianco per il testo nei bottoni
    fontSize: 13,
    fontWeight: 'bold',
  },
});