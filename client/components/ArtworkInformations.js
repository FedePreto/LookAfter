import React, { useEffect, useState, useContext , useCallback} from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, TouchableWithoutFeedback, ScrollView, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import { AudioContext } from './AudioProvider';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import HamburgerMenu from './HamBurgerMenu';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomNavigationBar from './CustomNavigationBar.js';
import theme, {useCustomFonts} from '../config/theme';

export default function ArtworkInformations({ navigation, route }) {
  const fontsLoaded = useCustomFonts();
  const { artworkKey } = route.params;
  const { isAudioOn, setIsAudioOn, setActiveScreen, activeScreen } = useContext(AudioContext);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const artworkMap = {
    monalisa: {
      name: 'Mona Lisa',
      image: require('../assets/monalisa.png'),
      description: [
        "Saluti, sono la Mona Lisa, ma forse mi conosci come La Gioconda. Leonardo da Vinci mi ha dipinta tra il 1503 e il 1506, durante il fiorire del Rinascimento. Da allora, il mio sguardo e il mio sorriso hanno incantato il mondo intero.",

        "Il mio sorriso è un enigma: osservalo a lungo e potresti notare come cambia, sottile e sfuggente, quasi come se custodissi un segreto. I miei occhi ti seguono ovunque, non importa da dove mi guardi, perché Leonardo ha saputo dare vita alla mia espressione con incredibile maestria.",

        "Oggi abito al Louvre, tra le mura di un museo che accoglie milioni di visitatori. Ogni giorno, persone da tutto il mondo si fermano davanti a me, cercando di decifrare il mistero che porto con me da secoli."
              
      ],
    },
    david: {
      name: 'Il David',
      image: require('../assets/david.png'),
      description: [
        "Ciao, sono David, il capolavoro di Michelangelo, scolpito tra il 1501 e il 1504. La mia figura imponente rappresenta forza e coraggio. Se potessi toccarmi, sentiresti i muscoli tesi e le vene in rilievo sulle mani, come se il sangue vi scorresse ancora.",

        "Raffiguro Davide prima della battaglia contro Golìa. Il mio corpo è saldo, il busto leggermente ruotato, lo sguardo concentrato. Anche senza vederlo, puoi immaginare la determinazione nel mio volto.",

        "Sono più di una statua: attraverso il marmo, racconto una storia di coraggio e trionfo umano."
      ],
    },
    ballon_girl:{
      name: 'Balloon girl',
      image: require('../assets/ballon.jpg'),
      description: [
        "Ciao, sono una ragazza con un palloncino tra le dita, leggera come il vento che accarezza i miei capelli. Sono in piedi in un campo aperto, respirando l’aria fresca mentre osservo il mio palloncino librarsi nel cielo limpido.",

        "È rosso, o forse giallo, brillante contro l’azzurro infinito sopra di me. Lo stringo ancora un po’, sentendo la sua superficie liscia e tesa tra le mani, come se volesse sfuggire via.",

        "Il mio vestito ondeggia dolcemente, e dentro di me sento una gioia semplice e pura. Sono qui, libera, con il mio sguardo rivolto verso l’alto, seguendo il volo leggero del mio palloncino."
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

  useFocusEffect(
    useCallback(() => {
      setActiveScreen('ArtworkInformations');
  
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      }).start();
  
      Speech.stop(); // Ensure no overlapping speech
  
      setTimeout(() => {
        if (isAudioOn) {
          console.log("Speaking:", textToRead);
          Speech.speak(textToRead, {
            language: 'it-IT',
            pitch: 1.0,
            rate: 0.9,
            onStart: () => console.log("Speech started"),
            onDone: () => console.log("Speech finished"),
            onError: (error) => console.error("Speech error:", error),
          });
        }
      }, 500); // Add delay to avoid race conditions
  
      return () => {
        Speech.stop();
      };
    }, [textToRead, isAudioOn])
  );
  

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
                onReplayAudio={() => Speech.speak(textToRead, {
                                        language: 'it-IT', // Ensure Italian is selected if needed
                                        pitch: 1.0, // Normal pitch
                                        rate: 0.9, // Adjust speed if needed
                                        onStart: () => console.log("Speech started"),
                                        onDone: () => console.log("Speech finished"),
                                        onError: (error) => console.error("Speech error:", error),
                                      })}
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
          onPress={() => navigation.navigate('ChatScreen', { artworkKey })}
          accessible={true}
          accessibilityLabel="Chatta con me"
          accessibilityRole="button"
        >
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
    backgroundColor: '#0055A4',
  },
  otherArtworksButton: {
    backgroundColor: '#0055A4',
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
    backgroundColor: '#0055A4',
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
    lineHeight: 30,
    textAlign: 'left',
    marginBottom: 15,
    paddingHorizontal: 10, 
  },
  chatButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#0055A4',
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
