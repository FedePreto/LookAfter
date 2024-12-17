import React, { useRef, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Audio } from "expo-av";

export default function RecordingScreen() {
  const [transcription, setTranscription] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const recordingRef = useRef(null);

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

  return (
    <View style={styles.container}>
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
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 20, marginBottom: 20 },
  button: { backgroundColor: "#007AFF", padding: 15, borderRadius: 10 },
  buttonText: { color: "#FFF", fontWeight: "bold" },
  transcription: { marginTop: 20, fontSize: 16, textAlign: "center" },
});
