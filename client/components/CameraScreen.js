import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, TouchableOpacity,TouchableWithoutFeedback, Alert, ImageBackground, Image, Platform, Animated } from 'react-native';
import { Camera, CameraView, CameraType } from 'expo-camera';
import Webcam from 'react-webcam';
import { useNavigation } from '@react-navigation/native';
import * as MediaLibrary from 'expo-media-library';
import { AudioContext } from './AudioProvider';
import * as Speech from 'expo-speech';
import HamburgerMenu from './HamBurgerMenu.js';
import AudioButton from './AudioButton.js';

export default function CameraScreen() {
  const [startCamera, setStartCamera] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [cameraType, setCameraType] = useState('back');
  const [flashMode, setFlashMode] = useState('off');
  const webcamRef = React.useRef(null);
  const cameraRef = React.useRef(null);
  const navigation = useNavigation();
  const [hasPermission, setHasPermission] = useState(null);
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState(null);

  const { isAudioOn, setActiveScreen, activeScreen } = useContext(AudioContext);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const textToRead = `Whenever you feel ready, touch the Take Picture button.`;

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      if (status === 'granted') {
        setStartCamera(true);
      } else {
        Alert.alert('Access denied');
      }
      const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();
      setHasMediaLibraryPermission(mediaLibraryPermission === 'granted');
    })();
  }, []);

  useEffect(() => {
    setActiveScreen('Camera1');
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();

    if (isAudioOn && activeScreen === 'Camera1') {
      Speech.speak(textToRead);
    } else {
      Speech.stop();
    }

    return () => {
      Speech.stop();
    };
  }, [textToRead, isAudioOn]);

  const __takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();
        if (mediaLibraryPermission.status !== 'granted') {
          Alert.alert(
            'Permission Denied',
            'Media Library access is required to save photos.'
          );
          return;
        }
        setCapturedImage(photo);
        setPreviewVisible(true);
        Alert.alert('Photo Saved', 'Photo saved to your device\'s gallery.');
        navigation.navigate('Preview', { images: photo.uri });
      } catch (error) {
        console.error('Error capturing photo:', error);
        Alert.alert('Error', 'Failed to capture image. Please try again.');
      }
    } else {
      Alert.alert('Camera not initialized');
    }
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
      <View style={styles.header}>
        <HamburgerMenu navigation={navigation} isVisible={dropdownVisible} toggleDropdown={toggleDropdown}/>
      </View>
      {Platform.OS === "web" ? (
        <View style={styles.cameraContainer}>
          <View style={styles.webCameraWrapper}>
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={{
                width: 1280,
                height: 720,
                facingMode: "user",
              }}
              style={styles.webCamera}
            />
          </View>
          <TouchableOpacity
            onPress={() => {
              const screenshot = webcamRef.current.getScreenshot();
              if (screenshot) {
                navigation.navigate("Preview", { images: screenshot });
              }
            }}
            style={styles.takePictureButton}
          >
            <Text style={styles.buttonText}>Take Picture</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <CameraView
          style={styles.camera}
          type={cameraType}
          ref={cameraRef}
        >
          <TouchableOpacity onPress={__takePicture} style={styles.takePictureButton}>
            <Text style={styles.buttonText}>Take Picture</Text>
          </TouchableOpacity>
        </CameraView>
      )}
      <AudioButton textToRead={textToRead} />
    </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    position: "absolute",
    top: 0,
    right: 10,
    zIndex: 1000,
    padding: 10,
  },
  cameraContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black", // Imposta uno sfondo per evidenziare il layout
    overflow: "hidden", // Nasconde contenuto che esce dai bordi
    position: "relative", // Importante per posizionare correttamente il pulsante
  },
  webCameraWrapper: {
    width: "100%",
    height: "100%",
    maxWidth: 800, // Limita la larghezza massima della webcam
    maxHeight: 600, // Limita l'altezza massima della webcam
    aspectRatio: 16 / 9, // Mantieni un rapporto di aspetto comune (opzionale)
    overflow: "hidden", // Nasconde contenuto extra
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000", // Per evitare "spazi bianchi"
  },
  webCamera: {
    width: "100%",
    height: "100%",
    objectFit: "cover", // Assicura che il video si adatti bene al contenitore
  },
  takePictureButton: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    backgroundColor: "#fff",
    borderRadius: 50,
    width: 80,
    height: 80,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
    zIndex: 10,
  },
  buttonText: {
    fontSize: 16,
    color: "#000",
  },
  camera: {
    flex: 1,
    width: "100%",
  },
});
