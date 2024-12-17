import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Assicurati di installare @expo/vector-icons

export default function ChatScreen({ route, navigation }) {
  const { artworkKey } = route.params;

  const [messages, setMessages] = useState([
    { sender: "bot", text: "Ciao! Come posso aiutarti?" },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input.trim() };
    const updatedMessages = [...messages, userMessage];

    let botResponse = null;
    if (input.toLowerCase().includes("occhi")) {
      botResponse = {
        sender: "bot",
        text: "Gli occhi della Monna Lisa sono enigmatici e sembrano seguire l'osservatore.",
        image: require('../assets/monalisa.png'), 
      };
    } else if (input.toLowerCase().includes("uomo")) {
      botResponse = {
        sender: "bot",
        text: "Se fosse un uomo, immagina un volto con tratti morbidi e delicati.",
        image: require('../assets/monnaliso.png'), 
      };
    } else {
      botResponse = { sender: "bot", text: "Non sono sicuro di capire. Puoi ripetere?" };
    }

    setMessages([...updatedMessages, botResponse]);
    setInput("");
  };

  const handleMicrophonePress = () => {
    navigation.navigate("RecordingScreen", {
      onRecordingComplete: (audioText) => setInput(audioText), // Callback per aggiornare il testo
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.chatContainer}>
        {messages.map((message, index) => (
          <View
            key={index}
            style={[
              styles.message,
              message.sender === "user" ? styles.userMessage : styles.botMessage,
            ]}
          >
            <Text style={styles.messageText}>{message.text}</Text>
            {message.image && <Image source={message.image} style={styles.messageImage} />}
          </View>
        ))}
      </ScrollView>
      <View style={styles.inputContainer}>
        <TouchableOpacity onPress={handleMicrophonePress} style={styles.microphoneButton}>
          <Ionicons name="mic" size={24} color="#007BFF" />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Scrivi un messaggio..."
          value={input}
          onChangeText={setInput}
        />
        <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
          <Text style={styles.sendButtonText}>Invia</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  chatContainer: { flex: 1, padding: 16 },
  message: { marginBottom: 12, padding: 10, borderRadius: 8 },
  userMessage: { alignSelf: "flex-end", backgroundColor: "#DCF8C6" },
  botMessage: { alignSelf: "flex-start", backgroundColor: "#E8E8E8" },
  messageText: { fontSize: 16 },
  messageImage: { marginTop: 8, width: 200, height: 100, borderRadius: 8 },
  inputContainer: { flexDirection: "row", padding: 8, borderTopWidth: 1, borderColor: "#ccc", alignItems: "center" },
  input: { flex: 1, borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 8, marginRight: 8 },
  sendButton: { backgroundColor: "#007BFF", borderRadius: 8, paddingVertical: 10, paddingHorizontal: 16 },
  sendButtonText: { color: "#fff", fontWeight: "bold" },
  microphoneButton: { marginRight: 8 },
});
