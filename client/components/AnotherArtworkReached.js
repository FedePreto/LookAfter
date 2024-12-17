import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';

export default function AnotherArtworkReached({ navigation }) {
  const handleProceed = () => {
    navigation.navigate('ArtworkInformationsBalloon');
  };

  const handleProceedMonalisa = () => {
    navigation.navigate('PathDetails');
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
          You didn't reach Monalisa, but you reached balloon girl instead!
        </Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleProceedMonalisa} style={styles.buttonLeft}>
          <Text style={styles.buttonText}>Bring me to Monalisa</Text>
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
    fontSize: 20,
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonLeft: {
    flex: 1,
    marginRight: 10,
    backgroundColor: '#d32f2f',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonRight: {
    flex: 1,
    marginLeft: 10,
    backgroundColor: '#1976d2',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});