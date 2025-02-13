import React, { useState, useEffect, useRef, useContext } from "react";
import {Modal, View, Text, TextInput, TouchableOpacity,Animated , TouchableWithoutFeedback,ScrollView, Image, StyleSheet,Keyboard,KeyboardAvoidingView,Platform } from "react-native";
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
  const [isRecordingInput, setIsRecordingInput] = useState(false);

  let textToRead = lastBotMessage ? lastBotMessage.text : "Non ci sono messaggi da riprodurre.";

  useEffect(() => {
    if (isRecordingInput && input !== "") {
      setTimeout(() => {
        handleSend();
      }, 500);
    }
  }, [input]); // Si attiva solo quando `input` cambia
  
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
    if (input.toLowerCase().includes("sorriso") && artworkKey === "monalisa") {
      botResponse = {
        sender: "bot",
        text: "Il mio sorriso! È il più grande enigma dell'arte. Forse sto per dire una battuta divertente … o forse so qualcosa che tu non sai!",
        image: require("../assets/sorriso.jpg"),
      };
    } else if (input.toLowerCase().includes("parlare") && artworkKey === "monalisa") {
      botResponse = {
        sender: "bot",
        text: "Dopo secoli dietro a questo vetro, vorrei uscire e respirare un po’ d’aria fresca!",
      };
    
    } else if (input.toLowerCase().includes("umana") && artworkKey === "monalisa") {
      botResponse = {
        sender: "bot",
        text: "Se fossi umana? Probabilmente sarei un’influencer con milioni di follower!",
      };
    } else if (input.toLowerCase().includes("capelli") && artworkKey === "monalisa") {
      botResponse = {
        sender: "bot",
        text: "I miei capelli sono un mistero: lisci, mossi, ondulati? Nemmeno Leonardo ha mai dato una risposta chiara.",
      };
    }
    else if (input.toLowerCase().includes("occhi") && artworkKey === "monalisa") {
      botResponse = {
        sender: "bot",
        text: "I miei occhi sembrano custodire un segreto, seguendoti ovunque con uno sguardo enigmatico che sfida il tempo e la distanza.",
        image: require("../assets/occhi.jpg"),
      };
    }
    else if (input.toLowerCase().includes("supereroe") && artworkKey === "monalisa") {
      botResponse = {
        sender: "bot",
        text: "Sicuramente sarei superman",
        image: require("../assets/superman.jpg"),

      };
    }
    else if (input.toLowerCase().includes("uomo") && artworkKey === "monalisa") {
      botResponse = {
        sender: "bot",
        text: "Mi chiamo Monnaliso. Sì, hai capito bene. Sono l'alter ego maschile della celebre Gioconda.",
        image: require("../assets/monnaliso.jpg"),

      };
    }
    
    // Ballon Girl
    else if (input.toLowerCase().includes("vento") && artworkKey === "ballon_girl") {
      botResponse = {
        sender: "bot",
        text: "Il vento accarezza i miei capelli mentre il mio palloncino si libra leggero nel cielo. Un momento di pura libertà.",
      };
    } else if (input.toLowerCase().includes("palloncino") && artworkKey === "ballon_girl") {
      botResponse = {
        sender: "bot",
        text: "Il mio palloncino è il simbolo dei sogni che volano via… o forse semplicemente del vento che me lo ha strappato di mano!",
        image: require("../assets/palloncino.jpg"),
      };
    } else if (input.toLowerCase().includes("triste") && artworkKey === "ballon_girl") {
      botResponse = {
        sender: "bot",
        text: "Triste? No, non proprio. Piuttosto malinconica. I sogni a volte ci sfuggono, ma possiamo sempre rincorrerli.",
      };
    } else if (input.toLowerCase().includes("colore") && artworkKey === "ballon_girl") {
      botResponse = {
        sender: "bot",
        text: "Rosso, giallo, blu… Il mio palloncino potrebbe essere di qualsiasi colore, proprio come i sogni di chi lo guarda.",
      };
    
    }
    
    // David
    else if (input.toLowerCase().includes("forte") && artworkKey === "david") {
      botResponse = {
        sender: "bot",
        text: "La forza non è solo nei miei muscoli, ma anche nel mio coraggio prima della battaglia contro Golia.",
      };
    } else if (input.toLowerCase().includes("nudo") && artworkKey === "david") {
      botResponse = {
        sender: "bot",
        text: "Eh sì, sono completamente nudo… ma con questa fisicità, perché coprirmi?",
      };
    
    } else if (input.toLowerCase().includes("vestito") && artworkKey === "david") {
      botResponse = {
        sender: "bot",
        text: "Se fossi vestito sicuramnte porterei uno abito elgante.",
        image: require("../assets/elegante.jpg"),
      };
    } else if (input.toLowerCase().includes("muscoli") && artworkKey === "david") {
      botResponse = {
        sender: "bot",
        text: "Ogni mio muscolo è scolpito nel marmo, segno della perfetta armonia tra forza e arte.",
      };
    }
    
    else {
      botResponse = { sender: "bot", text: "Non sono sicuro di capire. Puoi ripetere?" };
    }

    if (botResponse) {
      updatedMessages.push(botResponse);
      Speech.speak(botResponse.text);
      
    }

    setMessages(updatedMessages);
    saveMessages(updatedMessages);

    setInput("");
  };

  const handleMicrophonePress = () => {
    setIsRecordingInput(true);
    Speech.stop();
    setInput("");
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
const [selectedImage, setSelectedImage] = useState(null);


useEffect(() => {
  const updatePadding = chatHeight > 500 ? 120 : 80; 
  setInputHeight(updatePadding);
}, [chatHeight]);
  
// console.log(messages.text);

  return (    
      
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
            {message.image && (
              <TouchableOpacity onPress={() => setSelectedImage(message.image)}>
                <Image source={message.image} style={styles.messageImage} />
              </TouchableOpacity>
            )}

          </View>
        ))}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TouchableOpacity onPress={handleMicrophonePress} style={styles.microphoneButton}>
          <Ionicons name="mic" size={24} color="#0055A4" />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Scrivi un messaggio..."
          value={input}
          onChangeText={(text) => {
            setInput(text);
            setIsRecordingInput(false); // Se l'utente scrive a mano, disattiva il flag della registrazione
          }}
        />

        <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
          <Text style={styles.sendButtonText}>Invia</Text>
        </TouchableOpacity>
      </View>

    </View>
    <Modal visible={!!selectedImage} transparent={true} animationType="fade">
      <View style={styles.modalContainer}>
        <TouchableOpacity style={styles.closeButton} onPress={() => setSelectedImage(null)}>
          <Text style={styles.closeText}>✖</Text>
        </TouchableOpacity>
        <Image source={selectedImage} style={styles.fullscreenImage} />
      </View>
    </Modal>

  </KeyboardAvoidingView>

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
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
    backgroundColor: "white",
    borderRadius: 25, // Metà della width/height per renderlo perfettamente circolare
    borderWidth: 2, // Spessore del bordo
    borderColor: "black", // Colore del bordo
    justifyContent: "center", // Centra il contenuto verticalmente
    alignItems: "center", // Centra il contenuto orizzontalmente
    width: 50, // Deve essere uguale all’altezza per mantenere la forma circolare
    height: 50, 
  },
  closeText: {
    fontSize: 25,
    fontWeight: "bold",
    color: "black",
    textAlign: "center",
  },
  fullscreenImage: {
    width: "90%",
    height: "70%",
    resizeMode: "contain",
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
    width: "100%",  // Occupa tutto lo spazio disponibile
    height: undefined, // Permette il ridimensionamento dinamico
    aspectRatio: 1, // Mantiene il rapporto originale (puoi rimuoverlo se vuoi adattarlo liberamente)
    borderRadius: 12, 
    alignSelf: "center",
    resizeMode: "contain" // Assicura che l'immagine non venga tagliata
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
    backgroundColor: "#0055A4", 
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

