import React, { useState } from 'react';
import {StyleSheet,View,TouchableOpacity,Text,Modal,TouchableWithoutFeedback} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

export default function HamburgerMenu({ navigation, isVisible}) {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const __toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const __toggleAudio = () => {
    setIsAudioMuted(!isAudioMuted);
  };

  const __confirmGoHome = () => {
    setShowConfirmation(true);
  };

  const __goHome = () => {
    setShowConfirmation(false);
    navigation.navigate('MainPage'); // Replace with your Home screen name
  };

  const __cancelGoHome = () => {
    setShowConfirmation(false);
  };

  return (
    <TouchableWithoutFeedback>
    <View>
      <TouchableOpacity onPress={__toggleDropdown} style={styles.menuButton}>
        <Ionicons name="menu" size={30} color="black" />
      </TouchableOpacity>

      {dropdownVisible && (
        <View style={styles.dropdown}>
          <TouchableOpacity style={styles.dropdownItem} onPress={__toggleAudio}>
            <Text style={styles.dropdownText}>Audio</Text>
            <Ionicons
              name={isAudioMuted ? 'volume-mute' : 'volume-high'}
              size={20}
              color="black"
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.dropdownItem} onPress={__confirmGoHome}>
            <Text style={styles.dropdownText}>Home</Text>
            <MaterialIcons name="home" size={20} color="black" />
          </TouchableOpacity>
        </View>
      )}

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
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  menuButton: {
    padding: 10,
  },
  dropdown: {
    position: 'absolute',
    top: 40,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    padding: 10,
    width: 150,
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
