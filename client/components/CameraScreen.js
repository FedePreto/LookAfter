import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, ImageBackground, Image, Platform, Animated } from 'react-native';
import { Camera, CameraView, CameraType } from 'expo-camera';
import Webcam from 'react-webcam';
import { useNavigation } from '@react-navigation/native';
import * as MediaLibrary from 'expo-media-library';
import { AudioContext } from './AudioProvider';
import * as Speech from 'expo-speech';
import HamburgerMenu from './HamBurgerMenu.js';

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
  const textToRead = `Whenever you feel ready touch the Take Picture button.`;
  const [fadeAnim] = useState(new Animated.Value(0));
  const [dropdownVisible, setDropdownVisible] = useState(false);

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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <HamburgerMenu navigation={navigation} isVisible={dropdownVisible} />
      </View>
      {
        Platform.OS === 'web' ? (
          <View style={styles.cameraContainer}>
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              style={styles.camera}
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={__takePicture} style={styles.takePictureButton}>
                <Text style={styles.buttonText}>Take Picture</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <CameraView style={styles.camera} type={cameraType} ref={cameraRef}>
            <TouchableOpacity onPress={__takePicture} style={styles.takePictureButton}>
              <Text style={styles.buttonText}>Take Picture</Text>
            </TouchableOpacity>
          </CameraView>
        )
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  takePictureButton: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    backgroundColor: '#fff',
    borderRadius: 50,
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  buttonText: {
    fontSize: 16,
    color: '#000',
  },
  header: {
    position: 'absolute', // To position the menu above the camera view
    top: 0,
    right: 10, // Adjust this value to align the menu to the right
    zIndex: 1000, // Ensure it is above all other content
    padding: 10,
  },
  cameraContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
});
