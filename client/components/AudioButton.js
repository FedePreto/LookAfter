import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';

const AudioButton = ({ textToRead }) => {
    const handlePress = () => {
        Speech.stop(); // Ferma l'audio precedente
        Speech.speak(textToRead); // Avvia la lettura del nuovo testo
    };

    return (
        <TouchableOpacity style={styles.button} onPress={handlePress}>
            <Ionicons name="volume-high-outline" size={24} color="#fff" />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: '#007BFF',
        padding: 10,
        borderRadius: 20,
        elevation: 5, // Per aggiungere un'ombra (Android)
        shadowColor: '#000', // Per l'ombra (iOS)
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
});

export default AudioButton;