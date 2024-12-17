import React, { useState, useContext } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { AudioContext } from './AudioProvider'; // Importa il contesto

export default function HamburgerMenu({ navigation, isVisible }) {
  const [dropdownVisible, setDropdownVisible] = useState(false); // Stato del menu a tendina
  const [showConfirmation, setShowConfirmation] = useState(false); // Stato della conferma "Home"
  const { isAudioOn, toggleAudio } = useContext(AudioContext); // Accedi allo stato audio globale

  const __toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const __confirmGoHome = () => {
    setShowConfirmation(true);
  };

  const __goHome = () => {
    setShowConfirmation(false);
    navigation.navigate('MainPage'); // Vai alla schermata "Home"
  };

  const __cancelGoHome = () => {
    setShowConfirmation(false);
  };

  return (
    <View style={styles.container}>
      {/* Overlay per opacizzare il background */}
      {dropdownVisible && (
        <TouchableWithoutFeedback onPress={__toggleDropdown}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
      )}
  
      {/* Bottone del menu */}
      <TouchableOpacity onPress={__toggleDropdown} style={styles.menuButton}>
        <Ionicons name="menu" size={30} color="black" />
      </TouchableOpacity>
  
      {/* Dropdown menu */}
      {dropdownVisible && (
        <View style={styles.dropdown}>
          {/* Bottone per attivare/disattivare l'audio */}
          <TouchableOpacity style={styles.dropdownItem} onPress={toggleAudio}>
            <Text style={styles.dropdownText}>Audio</Text>
            <Ionicons
              name={isAudioOn ? 'volume-high' : 'volume-mute'}
              size={20}
              color="black"
            />
          </TouchableOpacity>
  
          {/* Bottone per tornare alla schermata Home */}
          <TouchableOpacity style={styles.dropdownItem} onPress={__confirmGoHome}>
            <Text style={styles.dropdownText}>Home</Text>
            <MaterialIcons name="home" size={20} color="black" />
          </TouchableOpacity>
        </View>
      )}
  
      {/* Modal di conferma per tornare alla schermata Home */}
      {showConfirmation && (
        <Modal transparent={true} animationType="fade" visible={showConfirmation}>
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalText}>
                Are you sure to go home? You are going to lose your progress.
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
  menuButton: {
    padding: 10,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Sfondo semi-trasparente
    zIndex: 1,
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
    zIndex: 2, // Più alto rispetto all'overlay
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