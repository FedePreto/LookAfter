import React, { useState } from "react";
import { SafeAreaView, TouchableWithoutFeedback, View, Text, TextInput, TouchableOpacity, ScrollView, Image, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Assicurati di installare @expo/vector-icons
import HamburgerMenu from './HamBurgerMenu';
import theme from '../config/theme';
import CustomNavigationBar from "./CustomNavigationBar.js";

export default function ChatScreen({ route, navigation }) {
  const { artworkKey } = route.params;
  const [dropdownVisible, setDropdownVisible] = useState(false);

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

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleOutsidePress = () => {
    if (dropdownVisible) {
      setDropdownVisible(false); // Close the menu if it's open
    }
  };
  

  return (    
      <TouchableWithoutFeedback onPress={handleOutsidePress}>
        <View style={styles.container}>
          <CustomNavigationBar
           navigation={navigation}
           isVisible={dropdownVisible} 
            toggleDropdown={toggleDropdown}
            showBackButton={true}
            showAudioButton={true}
            onReplayAudio={() => Speech.speak(textToRead)}
          />
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
      </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  chatContainer: { 
    flex: 1, 
    top: "10%",
    width: "95%",
  },
  message: { 
    marginBottom: 12, 
    padding: 12, 
    borderRadius: 16, 
    maxWidth: "80%", // Keep messages from stretching too wide
    shadowColor: "#000", // Add a shadow for depth
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 4,
    elevation: 3, // Shadow for Android
  },
  userMessage: { 
    alignSelf: "flex-end", 
    backgroundColor: "#D1F7C4", // Light green for user messages
    borderTopRightRadius: 0, // Differentiate sender visually
  },
  botMessage: { 
    alignSelf: "flex-start", 
    backgroundColor: "#FFFFFF", // White for bot messages
    borderTopLeftRadius: 0, // Differentiate sender visually
  },
  messageText: { 
    fontSize: 16, 
    color: "#333", // Neutral text color for readability
  },
  messageImage: { 
    marginTop: 8, 
    width: 200, 
    height: 150, // Slightly larger for better visibility
    borderRadius: 12, 
    alignSelf: "center" // Center the image in the message bubble
  },
  inputContainer: { 
    flexDirection: "row", 
    padding: 12, 
    borderTopWidth: 1, 
    borderColor: "#E0E0E0", // Subtle separator color
    alignItems: "center", 
    backgroundColor: "#FFFFFF", // White input background
  },
  input: { 
    flex: 1, 
    borderWidth: 1, 
    borderColor: "#E0E0E0", 
    borderRadius: 24, 
    padding: 10, 
    fontSize: 16, 
    backgroundColor: "#F9F9F9", // Light gray for input background
  },
  sendButton: { 
    backgroundColor: "#007BFF", // Primary blue color
    borderRadius: 24, 
    paddingVertical: 10, 
    paddingHorizontal: 16, 
    justifyContent: "center", 
    alignItems: "center", 
    marginLeft: 8, // Add space between input and button
  },
  sendButtonText: { 
    color: "#FFFFFF", 
    fontWeight: "bold", 
    fontSize: 16 
  },
  microphoneButton: { 
    justifyContent: "center", 
    alignItems: "center", 
    backgroundColor: "#E8F0FF", // Light blue for microphone button
    borderRadius: 24, 
    padding: 10, 
    marginRight: 8, // Space between mic button and input
  },
});

