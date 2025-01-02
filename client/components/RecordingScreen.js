import React, { useRef, useState } from "react";
import { SafeAreaView,TouchableWithoutFeedback,View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Audio } from "expo-av";
import { Ionicons } from "@expo/vector-icons";
import HamburgerMenu from './HamBurgerMenu';

export default function RecordingScreen({ route, navigation }) {
  const [transcription, setTranscription] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const recordingRef = useRef(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  // Avvia la registrazione
  const startRecording = async () => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
      await recording.startAsync();
      recordingRef.current = recording;
      setIsRecording(true);
    } catch (error) {
      console.error("Errore nella registrazione:", error);
    }
  };

  // Ferma la registrazione e invia l'audio al server
  const stopRecording = async () => {
    try {
      setIsRecording(false);
      await recordingRef.current.stopAndUnloadAsync();
      const uri = recordingRef.current.getURI();

      // Carica l'audio come file e invialo al server
      const audioFile = await fetch(uri);
      const audioBlob = await audioFile.blob();
      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.wav");

      const response = await fetch("http://localhost:4000/speech-to-text", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setTranscription(data.transcription || "Nessun testo trovato.");
    } catch (error) {
      console.error("Errore nell'invio del file audio:", error);
    }
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleOutsidePress = () => {
    if (dropdownVisible) {
      setDropdownVisible(false); // Close the menu if it's open
    }
  };
  

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={handleOutsidePress}>
        <View style={styles.container}>
          <View style={styles.header}>
            {/* Tasto Indietro con Freccia */}
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={40} color="black" />
            </TouchableOpacity>

            {/* Menu Hamburger - A Destra */}
            <View style={styles.hamburgerMenuWrapper}>
              <HamburgerMenu navigation={navigation} isVisible={dropdownVisible} toggleDropdown={toggleDropdown} />
            </View>
            
          </View>
          <Text style={styles.title}>Registrazione e Trascrizione</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={isRecording ? stopRecording : startRecording}
          >
            <Text style={styles.buttonText}>
              {isRecording ? "Ferma Registrazione" : "Inizia Registrazione"}
            </Text>
          </TouchableOpacity>
          <Text style={styles.transcription}>{transcription}</Text>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    justifyContent: "flex-start", 
    alignItems: "center", 
    backgroundColor: "#F5F5F5" 
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 20,
  },
  backButton: {
    padding: 10,
  },
  hamburgerMenuWrapper: {
    padding: 10,
  },
  title: { 
    fontSize: 24, 
    fontWeight: "bold", 
    textAlign: "center", 
    marginVertical: 20 
  },
  transcription: { 
    marginTop: 20, 
    fontSize: 18, 
    color: "#333", 
    textAlign: "center" 
  },
  button: { 
    backgroundColor: "#007AFF", 
    paddingVertical: 15, 
    paddingHorizontal: 25, 
    borderRadius: 8, 
    shadowColor: "#000", 
    shadowOpacity: 0.2, 
    shadowOffset: { width: 0, height: 2 }, 
    shadowRadius: 4, 
    elevation: 5, 
  },
  buttonText: { 
    color: "#FFF", 
    fontWeight: "600", 
    fontSize: 16, 
    textAlign: "center" 
  }
});
