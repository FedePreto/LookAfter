import React,  { useState,useContext } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Modal,TouchableWithoutFeedback } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { AudioContext } from './AudioProvider';

export default function HamburgerMenu({ navigation, isVisible, toggleDropdown }) {
  const { isAudioOn, toggleAudio } = useContext(AudioContext);
  const [showConfirmation, setShowConfirmation] = useState(false);

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
        <Ionicons name="menu" size={30} color="black" />
      </TouchableOpacity>

      {/* Dropdown Menu and Overlay */}
      {isVisible && (
        <>
          {/* Overlay */}
          <TouchableWithoutFeedback onPress={toggleDropdown}>
            <View style={StyleSheet.absoluteFillObject} />
          </TouchableWithoutFeedback>

          {/* Dropdown Menu */}
          <View style={styles.dropdown}>
            <TouchableOpacity style={styles.dropdownItem} onPress={toggleAudio}>
              <Text style={styles.dropdownText}>Audio</Text>
              <Ionicons
                name={isAudioOn ? 'volume-high' : 'volume-mute'}
                size={20}
                color="black"
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.dropdownItem}
              onPress={__confirmGoHome}
            >
              <Text style={styles.dropdownText}>Home</Text>
              <MaterialIcons name="home" size={20} color="black" />
            </TouchableOpacity>
          </View>
        </>
      )}

      {showConfirmation && (
        <Modal transparent={true} animationType="fade" visible={showConfirmation}>
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalText}>
                Are you sure you want to go home? You will lose your progress.
              </Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.modalButton} onPress={__goHome}>
                  <Text style={styles.modalButtonText}>Go Home</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalButton} onPress={__cancelGoHome}>
                  <Text style={styles.modalButtonText}>Cancel</Text>
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
    backgroundColor: '#fff',
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
    top: 40,
    right: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    padding: 10,
    width: 150,
    zIndex: 2, // Ensure it's above other elements
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    backgroundColor: '#f9f9f9',
    marginBottom: 10,
  },
  dropdownText: {
    fontSize: 16,
    color: '#333',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    width: '45%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
