import { useEffect, useRef, useState } from "react";
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
} from "react-native";
import { Audio } from "expo-av";
import { transcribeSpeech } from './functions.js';
import { recordSpeech } from './functions.js';
import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');


export default function RecordingScreen({ navigation }) {
  const [transcribedSpeech, setTranscribedSpeech] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);

  const [dropdownVisible, setDropdownVisible] = useState(false);

  const audioRecordingRef = useRef(new Audio.Recording());

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleOutsidePress = () => {
    if (dropdownVisible) {
      setDropdownVisible(false); 
    }
  };

  const handleInvia = () => {
   //       navigation.navigate('ChatScreen');
        
  };

  const startRecording = async () => {
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
    <SafeAreaView>
         <CustomNavigationBar
            navigation={navigation}
            isVisible={dropdownVisible} 
              toggleDropdown={toggleDropdown}
              showBackButton={true}
              showAudioButton={true}
              onReplayAudio={() => Speech.speak(textToRead)}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainScrollContainer: {
    padding: 20,
    height: "100%",
    width: "100%"
  },
  mainInnerContainer: {
    gap: 50,
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
    color: "#007fbb",
    marginTop: 90
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
    backgroundColor: "#007fbb",
    width: 100,
    height: 100,
    marginTop: 10,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  proceedButton: {
    backgroundColor: '#007fbb',
    width: width * 0.92,
    height: height * 0.08,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
});