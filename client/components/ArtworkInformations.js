import React, { useEffect, useState, useContext } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, TouchableWithoutFeedback, ScrollView, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import { AudioContext } from './AudioProvider';
import HamburgerMenu from './HamBurgerMenu';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomNavigationBar from './CustomNavigationBar.js';
import theme from '../config/theme';

export default function ArtworkInformations({ navigation, route }) {
  const { artworkKey } = route.params;
  const { isAudioOn, setIsAudioOn, setActiveScreen, activeScreen } = useContext(AudioContext);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const artworkMap = {
    monalisa: {
      name: 'Mona Lisa',
      image: require('../assets/monalisa.png'),
      description: [
        "Saluti, sono la Mona Lisa, conosciuta anche come La Gioconda. Sono stata dipinta dal geniale Leonardo da Vinci tra il 1503 e il 1506, durante l’età d’oro del Rinascimento italiano." ,

        "Sono famosa per il mio sorriso misterioso, un'espressione che ha affascinato e incuriosito gli spettatori per secoli. Osservami attentamente e noterai come cambia a seconda dell'angolazione e della tua percezione.",  

        "Guarda i miei occhi. Ovunque tu vada, sembrano seguirti, un risultato della straordinaria comprensione di Leonardo della prospettiva e dell’anatomia. Il mio sguardo ti cattura, invitandoti nel mio mondo senza tempo.",  

        "Oggi risiedo al Museo del Louvre a Parigi. Milioni di persone viaggiano da ogni angolo del mondo solo per ammirarmi."
              
      ],
    },
    david: {
      name: 'David',
      image: require('../assets/david.png'),
      description: [
        "Ciao, sono David, il capolavoro scolpito dal leggendario Michelangelo tra il 1501 e il 1504. Sto in piedi con fierezza, simbolo di forza, coraggio e determinazione giovanile." ,

        "Rappresento l'eroe biblico Davide, pochi istanti prima della sua epica battaglia contro Golia. Nota la tensione nella mia posa: i miei muscoli sono tesi, il mio sguardo è concentrato e sicuro."  ,

        "Avvicinati e osserva i dettagli intricati: le vene che scorrono lungo le mie mani, la curva dei miei muscoli e la determinazione nella mia espressione."  ,

        "Sono David, una storia di coraggio, arte e trionfo dello spirito umano."
      ],
    },
    ballon_girl:{
      name: 'Balloon girl',
      image: require('../assets/balloon.png'),
      description: [
        "Un'immagine vivace di una giovane ragazza in piedi in un campo aperto, mentre tiene in mano un palloncino dai colori vivaci." ,

        "Il palloncino, di un rosso o giallo intenso, crea un bellissimo contrasto con le delicate sfumature di un cielo azzurro limpido.",  

        "La ragazza, vestita con un abito semplice ma affascinante, guarda verso l’alto con uno sguardo di meraviglia e gioia."  ,

        "I suoi capelli fluttuano dolcemente nella brezza, e l'intera scena emana un senso di innocenza e libertà."
      ],
    }
  };

  const artwork = artworkMap[artworkKey];

  if (!artwork) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Artwork not found.</Text>
      </View>
    );
  }

  const textToRead = `${artwork.description.join(' ')} Se vuoi farmi delle domande, premi sul pulsante di chat.`;

  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    setActiveScreen('ArtworkInformations');

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();

    if (isAudioOn && activeScreen === 'ArtworkInformations') {
      Speech.speak(textToRead);
    } else {
      Speech.stop();
    }

    const unsubscribe = navigation.addListener('blur', () => {
      Speech.stop(); // Stop speech when the screen is no longer in focus
    });

    return () => {
      Speech.stop();
      unsubscribe();
    };
  }, [textToRead, isAudioOn, activeScreen]);

  const handleReplayAudio = () => {
    if (!isAudioOn && activeScreen === 'ArtworkInformations') {
      setIsAudioOn(true);
    }
    Speech.stop();
    Speech.speak(textToRead);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleOutsidePress = () => {
    if (dropdownVisible) {
      setDropdownVisible(false);
    }
  };

  return (
    // <TouchableWithoutFeedback onPress={handleOutsidePress} accessible = {true}>
    // <TouchableWithoutFeedback onPress={handleOutsidePress} accessible={false}>
      <View style={styles.container}>
        <CustomNavigationBar
                navigation={navigation}
                isVisible={dropdownVisible} 
                toggleDropdown={toggleDropdown}
                showBackButton={false}
                showAudioButton={true}
                onReplayAudio={() => Speech.speak(textToRead)}
                showNextArtwork = {true} 
                />
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={true}>
          {/* Header */}
          {/* <View style={styles.header}> */}
            {/* Pulsante "Other Artworks" */}
            {/* <TouchableOpacity
              onPress={() => navigation.navigate('ChooseArtwork', { artworkKey: 'david' })}
              style={styles.otherArtworksButton}>
              <Text style={styles.otherArtworksText}>Other Artworks</Text>
            </TouchableOpacity>
            
            {/* Menu Hamburger */}
            {/* <View style={styles.hamburgerMenuContainer}>
              <HamburgerMenu
                navigation={navigation}
                isVisible={dropdownVisible}
                toggleDropdown={toggleDropdown}
              />
            </View> */} 
            
          {/* </View> */}

          {/* Artwork Image */}
          <View style={styles.imageContainer}>
            <Image source={artwork.image} style={styles.artworkImage} />
            {/*<TouchableOpacity onPress={handleReplayAudio} style={styles.audioButton}>
              <Ionicons name="volume-high-outline" size={40} color="white" />
            </TouchableOpacity>*/}
          </View>

          {/* Title and Description */}
          <Text style={styles.title}>{artwork.name}</Text>
          {artwork.description.map((paragraph, index) => (
            <Animated.Text key={index} style={[styles.description, { opacity: fadeAnim }]}>
              {paragraph}
            </Animated.Text>
          ))}
        </ScrollView>

        {/* Chat Button */}
        <TouchableOpacity
          style={styles.chatButton}
          onPress={() => navigation.navigate('ChatScreen', { artworkKey })}>
          <Ionicons name="chatbubble-outline" size={40} color="white" />
        </TouchableOpacity>
      </View>
    //  </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    flexGrow:1,
    padding: 20,
    top: 50,
    paddingBottom: 120,
  },
  // header: {
  //   flex: 1,
  //   backgroundColor: theme.colors.background,
  //   alignItems: 'center',
  //   justifyContent: 'center',
  // },
  hamburgerMenuContainer: {
    position: 'absolute',
    right: 10, // Posiziona il menu a destra
    backgroundColor: '#007fbb',
  },
  otherArtworksButton: {
    backgroundColor: '#007fbb',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  otherArtworksText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  artworkImage: {
    width: 300,
    height: 350,
    resizeMode: 'contain',
    borderRadius: 10,
  },
  audioButton: {
    position: 'absolute',
    bottom: -20,
    right: 20,
    backgroundColor: '#007fbb',
    padding: 15,
    borderRadius: 50,
    elevation: 5,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginBottom: 20,
  },
  description: {
    fontSize: 30,
    color: '#555',
    lineHeight: 28,
    textAlign: 'left',
    marginBottom: 15,
    paddingHorizontal: 10, 
  },
  chatButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#007fbb',
    padding: 15,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  errorText: {
    fontSize: 20,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});
