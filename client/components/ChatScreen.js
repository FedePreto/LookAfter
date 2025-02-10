import React, { useState, useEffect, useRef, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity,Animated , TouchableWithoutFeedback,ScrollView, Image, StyleSheet,Keyboard,KeyboardAvoidingView,Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons"; 
import theme from '../config/theme';
import AsyncStorage from "@react-native-async-storage/async-storage"; 
import CustomNavigationBar from "./CustomNavigationBar.js";
import * as Speech from 'expo-speech'; 
import ImageViewer from 'react-native-image-zoom-viewer';
import { AudioContext } from './AudioProvider';

export default function ChatScreen({ route, navigation }) {
  const { artworkKey } = route.params;
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [input, setInput] = useState("");
   const [fadeAnim] = useState(new Animated.Value(0));
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Ciao! Come posso aiutarti?" },
  ]);
  const { isAudioOn, setActiveScreen, activeScreen } = useContext(AudioContext); // Stato audio scelto dal menù
  const lastBotMessage = messages.filter((msg) => msg.sender === "bot").pop(); 

const textToRead = lastBotMessage ? lastBotMessage.text : "Non ci sono messaggi da riprodurre.";

  
 useEffect(() => {
     if (isAudioOn) {
       Speech.speak(textToRead); // Parla solo se isAudioOn è true
     }
     return () => {
       Speech.stop(); // Ferma la riproduzione quando si esce dalla schermata
     };
   }, [isAudioOn]);
 
   useEffect(() => {
     Animated.timing(fadeAnim, {
       toValue: 1,
       duration: 2000,
       useNativeDriver: true,
     }).start();
   }, []);
  const loadMessages = async () => {
    try {
      const storedMessages = await AsyncStorage.getItem(`chatMessages_${artworkKey}`);
      if (storedMessages) {
        setMessages(JSON.parse(storedMessages)); 
      }
    } catch (error) {
      console.error("Errore nel caricare i messaggi", error);
    }
  };

  const saveMessages = async (messages) => {
    try {
      await AsyncStorage.setItem(`chatMessages_${artworkKey}`, JSON.stringify(messages));
    } catch (error) {
      console.error("Errore nel salvare i messaggi", error);
    }
  };


  useEffect(() => {
    loadMessages();
  }, []);


  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input.trim() };
    const updatedMessages = [...messages, userMessage];

    let botResponse = null;
    if (input.toLowerCase().includes("occhi")) {
      botResponse = {
        sender: "bot",
        text: "Gli occhi della Monna Lisa sono enigmatici e sembrano seguire l'osservatore.",
        image: require("../assets/occhi.png"),
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

    if (botResponse) {
      updatedMessages.push(botResponse);
    }

    setMessages(updatedMessages);
    saveMessages(updatedMessages);

    setInput("");
  };

  const handleMicrophonePress = () => {
    Speech.stop();
    navigation.navigate("RecordingScreen", {
      onRecordingComplete: (audioText) => {
        setInput(audioText);
        setTimeout(() => {
          handleSend(); // Ora viene invocato correttamente
        }, 500);
      },
    });
  };
  

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleOutsidePress = () => {
    if (dropdownVisible) {
      setDropdownVisible(false); 
    }
  };

const scrollViewRef = useRef(null);
const [keyboardHeight, setKeyboardHeight] = useState(0);


useEffect(() => {
  const keyboardDidShowListener = Keyboard.addListener("keyboardDidShow", (event) => {
    setKeyboardHeight(event.endCoordinates.height);
  });

  const keyboardDidHideListener = Keyboard.addListener("keyboardDidHide", () => {
    setKeyboardHeight(0);
  });

  return () => {
    keyboardDidShowListener.remove();
    keyboardDidHideListener.remove();
  };
}, []);

useEffect(() => {
  if (scrollViewRef.current) {
    scrollViewRef.current.scrollToEnd({ animated: true });
  }
}, [messages, keyboardHeight]); 

const [chatHeight, setChatHeight] = useState(0);
const [inputHeight, setInputHeight] = useState(60); 

useEffect(() => {
  const updatePadding = chatHeight > 500 ? 120 : 80; 
  setInputHeight(updatePadding);
}, [chatHeight]);
  
// console.log(messages.text);

  return (    
      <TouchableWithoutFeedback onPress={handleOutsidePress}> 
        <KeyboardAvoidingView 
          style={{ flex: 1 }} 
          behavior={Platform.OS === "ios" ? "padding" : undefined} 
          keyboardVerticalOffset={62}
        >
        <View style={styles.container}>
          <CustomNavigationBar
           navigation={navigation}
           isVisible={dropdownVisible} 
            toggleDropdown={toggleDropdown}
            showBackButton={true}
            showAudioButton={true}
            onReplayAudio={() => Speech.speak(textToRead)}
          />
       <ScrollView 
          style={styles.chatContainer} 
          ref={scrollViewRef}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: inputHeight }}
          keyboardShouldPersistTaps="handled"
          onScrollBeginDrag={Keyboard.dismiss} 
          onContentSizeChange={(contentWidth, contentHeight) => {
            setChatHeight(contentHeight);
            scrollViewRef.current?.scrollToEnd({ animated: true });
          }}
          
        >
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
  </KeyboardAvoidingView>
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
    maxWidth: "80%", 
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 4,
    elevation: 3, 
  },
  userMessage: { 
    alignSelf: "flex-end", 
    backgroundColor: "#D1F7C4", 
    borderTopRightRadius: 0, 
  },
  botMessage: { 
    alignSelf: "flex-start", 
    backgroundColor: "#FFFFFF", 
    borderTopLeftRadius: 0, 
  },
  messageText: { 
    fontSize: 16, 
    color: "#333", 
  },
  messageImage: { 
    marginTop: 8, 
    width: 230, 
    height: 150, 
    borderRadius: 12, 
    alignSelf: "center"
  },
  inputContainer: { 
    flexDirection: "row", 
    padding: 12, 
    borderTopWidth: 1, 
    borderColor: "#E0E0E0", 
    alignItems: "center", 
    backgroundColor: "#FFFFFF", 
  },
  input: { 
    flex: 1, 
    borderWidth: 1, 
    borderColor: "#E0E0E0", 
    borderRadius: 24, 
    padding: 10, 
    fontSize: 16, 
    backgroundColor: "#F9F9F9", 
  },
  sendButton: { 
    backgroundColor: "#007BFF", 
    borderRadius: 24, 
    paddingVertical: 10, 
    paddingHorizontal: 16, 
    justifyContent: "center", 
    alignItems: "center", 
    marginLeft: 8, 
  },
  sendButtonText: { 
    color: "#FFFFFF", 
    fontWeight: "bold", 
    fontSize: 16 
  },
  microphoneButton: { 
    justifyContent: "center", 
    alignItems: "center", 
    backgroundColor: "#E8F0FF",
    borderRadius: 24, 
    padding: 10, 
    marginRight: 8, 
  },
});

