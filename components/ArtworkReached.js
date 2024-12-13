import React from 'react';
import { StyleSheet, Text, View, Image, Alert, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import HamburgerMenu from './HamBurgerMenu';
export default function ArtworkReached({ navigation }) {
  const route = useRoute(); // Ottieni il route
  const { artworkKey } = route.params || {}; // Estrai artworkKey dai parametri

  const handleProceed = () => {
    navigation.navigate('ArtworkInformations', { artworkKey });
  };

  // Mappa delle immagini in base a artworkKey
  const images = {
    monalisa: require('../assets/monalisa.png'),
    david: require('../assets/david.png'),
  };

  // Seleziona l'immagine corretta o un'immagine predefinita
  const artworkImage = images[artworkKey] ;
  const handleIconClick = () => {
      Alert.alert('Icon Clicked!', 'You clicked the audio icon.');
    };
  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
              <Image source={artworkImage} style={styles.headerImage} />
              <View style={styles.headerIcons}>
              <TouchableOpacity onPress={handleIconClick} style={styles.iconWrapper}>
                <Image
                  source={require('../assets/audio_repeat.png')} // Replace with actual icon URI
                  style={styles.icon}
                />
                </TouchableOpacity>
                </View>
                <View style = {styles.header}>
                  <HamburgerMenu navigation={navigation}/>
                </View>
              
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    right:-10,
    top:-20,
  },
  headerImage: {
    width: 100,
    height: 100,
    resizeMode:'contain',
    left: 70,
  },
  headerIcons: {
    flexDirection: 'row',
    left: 50,
    bottom: 40,
  },
  icon: {
    width: 30,
    height: 30,
    marginLeft: 10,
    top:10,
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
