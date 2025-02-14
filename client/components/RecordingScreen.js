import { useEffect, useRef, useState, useContext, useCallback} from "react";
import Icon from "react-native-vector-icons/FontAwesome"; 
import CustomNavigationBar from "./CustomNavigationBar.js";
import {
  StyleSheet,
  Text,
  SafeAreaView,
  ScrollView,
  View,
  ActivityIndicator,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { Audio } from "expo-av";
import { transcribeSpeech } from './functions.js';
import { recordSpeech } from './functions.js';
import { Dimensions } from 'react-native';
import { AudioContext } from './AudioProvider';
import * as Speech from 'expo-speech'; 
import theme, {useCustomFonts}from '../config/theme';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
const { width, height } = Dimensions.get('window');



export default function RecordingScreen({ navigation,route }) {
  const fontsLoaded = useCustomFonts();
  const [transcribedSpeech, setTranscribedSpeech] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);

  const [dropdownVisible, setDropdownVisible] = useState(false);
  const { onRecordingComplete } = route.params || {};
  const audioRecordingRef = useRef(new Audio.Recording());
  const { isAudioOn, setActiveScreen, activeScreen } = useContext(AudioContext); // Stato audio scelto dal menù

  const textToRead = "Tieni premuto il pulsante del microfono per iniziare la registrazione. Rilascia il pulsante per terminare la registrazione. Per inviare il testo trascritto premi il pulsante Invia.";


  useFocusEffect(
        useCallback(() => {
          setActiveScreen('Path'); // Update the active screen
          
          if (fontsLoaded && isAudioOn) {
            Speech.stop(); // Stop any ongoing speech
            
            setTimeout(() => {
              console.log("Speaking:", textToRead); // Debugging: Check if this runs
              
              Speech.speak(textToRead, {
                language: 'it-IT', // Ensure Italian is selected if needed
                pitch: 1.0, // Normal pitch
                rate: 0.9, // Adjust speed if needed
                onStart: () => console.log("Speech started"),
                onDone: () => console.log("Speech finished"),
                onError: (error) => console.error("Speech error:", error),
              });
            }, 500); // Delay to ensure smooth playback
          }
      
          return () => {
            Speech.stop(); // Stop speech when leaving the screen
          };
        }, [fontsLoaded, isAudioOn, textToRead])
      );

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleOutsidePress = () => {
    if (dropdownVisible) {
      setDropdownVisible(false); 
    }
  };

  const handleInvia = () => {
    onRecordingComplete(transcribedSpeech); 
    navigation.goBack();
        
  };

  const startRecording = async () => {
    Speech.stop();
    setIsRecording(true);
    await recordSpeech(
      audioRecordingRef,
      setIsRecording
    );
  };

  const stopRecording = async () => {
    setIsRecording(false);
    setIsTranscribing(true);
    try {
      const speechTranscript = await transcribeSpeech(audioRecordingRef);
      setTranscribedSpeech(speechTranscript || "");
    } catch (e) {
      console.error(e);
    } finally {
      setIsTranscribing(false);
    }
  };

  return ( 
      <TouchableWithoutFeedback onPress={handleOutsidePress}>
        <SafeAreaView>
        {/* <View> */}
         <CustomNavigationBar
            navigation={navigation}
            isVisible={dropdownVisible} 
              toggleDropdown={toggleDropdown}
              showBackButton={true}
              showAudioButton={true}
              onReplayAudio={() => Speech.speak(textToRead, {
                            language: 'it-IT', // Ensure Italian is selected if needed
                            pitch: 1.0, // Normal pitch
                            rate: 0.9, // Adjust speed if needed
                            onStart: () => console.log("Speech started"),
                            onDone: () => console.log("Speech finished"),
                            onError: (error) => console.error("Speech error:", error),
                          })}
          />
      <ScrollView style={styles.mainScrollContainer}>
        <View style={styles.mainInnerContainer}>
       
          <Text style={styles.title}> Trascrizione audio</Text>
          <View style={styles.transcriptionContainer}>
            {isTranscribing ? (
              <ActivityIndicator size="small" color="#000" />
            ) : (
              <Text
                style={{
                  ...styles.transcribedText,
                  color: transcribedSpeech ? "#000" : "rgb(150,150,150)",
                }}
              >
                {transcribedSpeech ||
                  "Il tuo testo trascritto apparirà qui..."}
              </Text>
            )}
          </View>
          <TouchableOpacity
            style={{
              ...styles.microphoneButton,
              opacity: isRecording || isTranscribing ? 0.5 : 1,
            }}
            onPressIn={startRecording}
            onPressOut={stopRecording}
            disabled={isRecording || isTranscribing}
          >
            <Icon name="microphone" size={40} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleInvia} style={styles.proceedButton}>
                  <Text style={styles.buttonText}>Invia</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      {/* </View> */}
      
     </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  mainScrollContainer: {
    padding: 15,
    height: "100%",
    width: "100%"
  },
  mainInnerContainer: {
    gap: 40,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    flexGrow: 1,
  },
  title: {
    fontSize: 35,
    padding: 5,
    fontWeight: "bold",
    textAlign: "center",
    color: "#0055A4",
    marginTop: 70
  },
  transcriptionContainer: {
    backgroundColor: "rgb(220,220,220)",
    width: "100%",
    height: 300,
    padding: 20,
    marginBottom: 20,
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  transcribedText: {
    fontSize: 20,
    padding: 5,
    color: "#000",
    textAlign: "left",
    width: "100%",
  },
  microphoneButton: {
    backgroundColor: "#0055A4",
    width: 100,
    height: 100,
    marginTop: 5,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  proceedButton: {
    backgroundColor: '#0055A4',
    width: width * 0.92,
    height: height * 0.08,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
});