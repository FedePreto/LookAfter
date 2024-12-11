import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, ImageBackground, Image, Platform } from 'react-native';
import { Camera,CameraView, CameraType } from 'expo-camera';
import Webcam from 'react-webcam';
import { useNavigation } from '@react-navigation/native';
import * as MediaLibrary from 'expo-media-library';
import * as Permissions from 'expo-permissions';


export default function CameraConfirmation() {
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
    
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      if (status === 'granted') {
        setStartCamera(true);
      } else {
        Alert.alert('Access denied');
      }
      const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();
      // setPermission(status === 'granted');
      // const { status: mediaLibraryStatus } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);
    // if (mediaLibraryStatus !== 'granted') {
    //   Alert.alert('Sorry, we need camera roll permissions to make this work!');
    // }
    setHasMediaLibraryPermission(mediaLibraryPermission === 'granted')
    })();
  }, []);
    

  
  const __takePicture = async () => {
    if (cameraRef.current) { // Ensure cameraRef is valid
      console.log("Taking picture...");
      try {
        const photo = await cameraRef.current.takePictureAsync();
        console.log("Captured photo URI:", photo.uri);
        const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();
        if(mediaLibraryPermission.status != 'granted'){
          Alert.alert(
            'Permission Denied',
            'Media Library access is required to save photos.'
          );
          return;
        }
        // await MediaLibrary.saveToLibraryAsync(photo.uri);
        setCapturedImage(photo); // Store captured image
        setPreviewVisible(true); // Navigate to Preview if picture is captured
        Alert.alert('Photo Saved', 'Photo saved to your device\'s gallery.');
        navigation.navigate('PreviewConfirmation', { images: photo.uri });
      } catch (error) {
        console.error("Error capturing photo:", error);
        Alert.alert("Error", "Failed to capture image. Please try again.");
      }
    } else {
      Alert.alert('Camera not initialized');
    }
  };
  
  
    // if (!hasPermission && Platform.OS !== 'web') {
    //   return <Text>Requesting camera permission...</Text>;
    // }
  
    // if (!hasMediaLibraryPermission && Platform.OS !== 'web') {
    //   return <Text>Requesting media library permission...</Text>;
    // }
  
    return (
      <View style={styles.container}>
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
        bottom: 40, // Adjust to position the button at the bottom middle
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
});
  
  
