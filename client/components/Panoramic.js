import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, Image, ScrollView, Platform } from 'react-native';
import { Camera, CameraView } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';


export default function Panoramica() {
  const [startCamera, setStartCamera] = useState(false);
  const [capturedImages, setCapturedImages] = useState([]);
  const [isCapturingPanorama, setIsCapturingPanorama] = useState(false);
  const cameraRef = useRef(null);
  const navigation = useNavigation();

  const __startCamera = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    if (status === 'granted') {
      setStartCamera(true);
    } else {
      Alert.alert('Permission Denied', 'Camera access is required to use this feature.');
    }
  };

  const __startPanoramaCapture = async () => {
    if (!cameraRef.current) return;

    setCapturedImages([]);
    setIsCapturingPanorama(true);

    const images = [];
    for (let i = 0; i < 5; i++) { // Capture 5 images for the panorama
      try {
        const photo = await cameraRef.current.takePictureAsync({skipProcessing: true});
        images.push(photo.uri);
        setCapturedImages([...images]);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second between captures
      } catch (error) {
        console.error("Error capturing image:", error);
        break;
      }
    }

    setIsCapturingPanorama(false);
    
    // if (images.length === 5) {
    //   console.log("All images captured successfully:", images);
    //   Alert.alert('Panorama Complete', 'Panorama images captured.');
    // } else {
    //   console.warn(`Expected 5 images, but captured only ${images.length}.`, images);
    //   Alert.alert('Panorama Incomplete', `Captured ${images.length} out of 5 images.`);
    // }
    
    navigation.navigate('Preview', { images });
  };

  if (!startCamera) {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={__startCamera} style={styles.startButton}>
          <Text style={styles.text}>Start Camera</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} ref={cameraRef}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={__startPanoramaCapture} style={styles.button}>
            <Text style={styles.text}>
              {isCapturingPanorama ? 'Capturing...' : 'Start Panorama'}
            </Text>
          </TouchableOpacity>
        </View>
      </CameraView>
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
  buttonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  button: {
    backgroundColor: '#1E90FF',
    padding: 15,
    margin: 20,
    borderRadius: 10,
  },
  text: {
    color: '#fff',
    fontSize: 16,
  },
  startButton: {
    backgroundColor: '#1E90FF',
    padding: 20,
    borderRadius: 10,
  },
});
