import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Audio } from "expo-av"; // Assicurati di installare `expo-av`
//import * as SpeechRecognition from "expo-speech-recognition";

export default function RecordingScreen({ route, navigation }) {
  const [recording, setRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);

  const startRecording = async () => {
    try {
      //const isAvailable = await SpeechRecognition.isAvaila
      const permission = await Audio.requestPermissionsAsync();
      if (permission.granted) {
        const { recording } = await Audio.Recording.createAsync(
          Audio.RecordingOptionsPresets.HIGH_QUALITY
        );
        setRecording(recording);
        setIsRecording(true);
      }
    } catch (err) {
      console.error("Errore durante la registrazione:", err);
    }
  };

  const stopRecording = async () => {
    setIsRecording(false);
    if (recording) {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      console.log("Registrazione salvata in:", uri);

      // Simuliamo il testo convertito dalla registrazione (aggiungere Speech-to-Text se necessario)
      const simulatedText = "Testo trascritto dalla registrazione";

      // Passa il testo alla schermata di chat
      route.params.onRecordingComplete(simulatedText);
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {isRecording ? "Registrazione in corso..." : "Premi per iniziare la registrazione"}
      </Text>
      <TouchableOpacity
        onPress={isRecording ? stopRecording : startRecording}
        style={styles.recordButton}
      >
        <Text style={styles.recordButtonText}>{isRecording ? "Ferma" : "Inizia"}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
  title: { fontSize: 18, marginBottom: 16 },
  recordButton: { backgroundColor: "#FF0000", padding: 20, borderRadius: 50 },
  recordButtonText: { color: "#fff", fontWeight: "bold" },
});
