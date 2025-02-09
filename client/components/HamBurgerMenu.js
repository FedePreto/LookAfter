import React,  { useEffect, useState,useContext } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Modal,TouchableWithoutFeedback } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { AudioContext } from './AudioProvider';
import { SafeAreaView } from 'react-native-safe-area-context';
import theme from '../config/theme';
import * as Speech from 'expo-speech';

export default function HamburgerMenu({ navigation, isVisible, toggleDropdown, audio}) {
  const { isAudioOn, toggleAudio } = useContext(AudioContext);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    if (isAudioOn && audio) {
      // Speech.stop(); // Stop any ongoing speech
      Speech.speak(audio); // Speak only the current page's text
    }
    return () => {
      // Speech.stop(); // Stop speech when the component unmounts
    };
  }, [audio, isAudioOn]); // Depend on audio content instead of just isAudioOn
  // Dipendenza: si aggiorna se cambia isAudioOn

  const __confirmGoHome = () => {
    setShowConfirmation(true);
  };

  const __goHome = () => {
    setShowConfirmation(false);
    navigation.navigate('MainPage'); // Navigate to "Home" screen
  };

  const __cancelGoHome = () => {
    setShowConfirmation(false);
  };
  return (
    <View style={styles.container}>
      {/* Menu Button */}
      <TouchableOpacity onPress={toggleDropdown} style={styles.menuButton}>
        <Ionicons name="menu" size={40} color="white" />
      </TouchableOpacity>

      {/* Dropdown Menu and Overlay */}
      {isVisible && (
        <TouchableWithoutFeedback onPress={toggleDropdown}>
          <View style={styles.overlay}>
            <View style={styles.dropdown}>
              <TouchableOpacity style={styles.dropdownItem} onPress={toggleAudio}>
                <Text style={styles.dropdownText}>Audio</Text>
                <Ionicons
                  name={isAudioOn ? 'volume-high' : 'volume-mute'}
                  size={28}
                  color="white"
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.dropdownItem} onPress={__confirmGoHome}>
                <Text style={styles.dropdownText}>Home</Text>
                <MaterialIcons name="home" size={28} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      )}

      {showConfirmation && (
        <Modal transparent={true} animationType="fade" visible={showConfirmation}>
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalText}>
                Are you sure you want to go home? You will lose your progress.
              </Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.modalButton} onPress={__cancelGoHome}>
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalButton2} onPress={__goHome}>
                  <Text style={styles.modalButtonText2}>Go Home</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    zIndex: 1,
  },
  menuButton: {
    padding: 10,
  },
  dropdown: {
    position: 'absolute',
    top: 50,
    right: 10,
    backgroundColor: theme.colors.background,
    borderColor: '#007fbb',
    borderWidth: 2,  
    borderRadius: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    padding: 10, // Increase padding for a larger look
    width: 200, // Increase width
    zIndex: 2, // Ensure it's above other elements
    // Centering buttons inside
    justifyContent: 'center',  // Aligns buttons in the middle
    alignItems: 'center', 
  },
  
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,   // Increase vertical padding for spacing
    paddingHorizontal: 20, // Increase horizontal padding
    borderRadius: 5,
    backgroundColor: '#007fbb', 
    marginVertical: 8,  // Space between buttons
    width: '100%',      // Ensure buttons take full width inside dropdown
  },
  
  
  
  dropdownText: {
    fontSize: 24, // Make text size consistent
    color: 'white',
    flex: 1, // Make sure text takes full space
    textAlign: 'left', // Align text properly
    paddingLeft: 10, // Add left padding to match icon spacing
    fontWeight: 'bold'
  },
  
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    padding: 20,
    borderRadius: 10,
    backgroundColor: theme.colors.background,
    width: '100%',

  },
  modalText: {
    fontSize: 25,
    marginBottom: 25,
    textAlign: 'center',
    color: '#007fbb',
    fontWeight: 'bold',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 5,
    width: '45%',
    alignItems: 'center',
    borderColor:'#007fbb',
  },
  modalButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color:'#007fbb'
  },
  modalButton2: {
    padding: 10,
    borderRadius: 5,
    width: '45%',
    alignItems: 'center',
    backgroundColor: '#007fbb',
  },
  modalButtonText2: {
    fontSize: 20,
    fontWeight: 'bold',
    color:'white'
  },
});
