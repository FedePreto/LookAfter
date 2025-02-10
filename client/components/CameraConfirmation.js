import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, ImageBackground, Image, Platform, Animated,TouchableWithoutFeedback, SafeAreaView } from 'react-native';
import { Camera,CameraView, CameraType } from 'expo-camera';
import Webcam from 'react-webcam';
import * as MediaLibrary from 'expo-media-library';
import { useNavigation, useRoute } from '@react-navigation/native'; // Importa useRoute
import { AudioContext } from './AudioProvider';
import * as Speech from 'expo-speech';
import HamburgerMenu from './HamBurgerMenu';
import theme from '../config/theme';
import CustomNavigationBar from './CustomNavigationBar.js';

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
    const route = useRoute(); // Ottieni il route
    const { artworkKey } = route.params || {}; // Estrai artworkKey dai parametri

    const { isAudioOn, setActiveScreen, activeScreen } = useContext(AudioContext);
    const textToRead = "Quando ti senti pronto, fammi una foto premendo il pulsante Scatta Foto.";
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
      // setPermission(status === 'granted');
      // const { status: mediaLibraryStatus } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);
    // if (mediaLibraryStatus !== 'granted') {
    //   Alert.alert('Sorry, we need camera roll permissions to make this work!');
    // }
    setHasMediaLibraryPermission(mediaLibraryPermission === 'granted')
    })();
  }, []);

  useEffect(() => {
        if (isAudioOn) {
          Speech.speak(textToRead); // Parla solo se isAudioOn è true
        }
        
        return () => {
          Speech.stop(); // Ferma la riproduzione quando si esce dalla schermata
        };
      }, [isAudioOn]); // Dipendenza: si aggiorna se cambia isAudioOn
  
      useEffect(() => {
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }).start();
        }, []);

  // useEffect(() => {
  //         setActiveScreen('ArrivalConfirmation');
  //         Animated.timing(fadeAnim, {
  //           toValue: 1,
  //           duration: 2000,
  //           useNativeDriver: true,
  //         }).start();
      
  //         if (isAudioOn && activeScreen === 'ArrivalConfirmation') {
  //           Speech.speak(textToRead);
  //         } else {
  //           Speech.stop();
  //         }
      
  //         return () => {
  //           Speech.stop();
  //         };
  // }, [textToRead, isAudioOn]);
    

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
        //Alert.alert('Photo Saved', 'Photo saved to your device\'s gallery.');
        Speech.stop();
        navigation.navigate('PreviewConfirmation', { images: photo.uri,  artworkKey});
      } catch (error) {
        console.error("Error capturing photo:", error);
        Alert.alert("Error", "Failed to capture image. Please try again.");
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
        <CustomNavigationBar
            navigation={navigation}
            isVisible={dropdownVisible} 
            toggleDropdown={toggleDropdown}
            showBackButton={false}
            showAudioButton={true}
            onReplayAudio={() => Speech.speak(textToRead)}
            />
          
        {Platform.OS === 'web' ? (
          <View style={styles.cameraContainer}>
            <View style={styles.webCameraWrapper}>
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                style={styles.webCamera}
              />
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={() => {
                  const screenshot = webcamRef.current.getScreenshot();
                  if (screenshot) {
                    Speech.stop();
                    navigation.navigate("Preview", { images: screenshot });
                  }
                }}
                style={styles.takePictureButton}
              >
                <Text style={styles.buttonText}>Take Picture</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <CameraView style={styles.camera} type={cameraType} ref={cameraRef}>
            <TouchableOpacity onPress={__takePicture} style={styles.takePictureButton}>
              <Text style={styles.buttonText}>Scatta Foto</Text>
            </TouchableOpacity>
          </CameraView>
        )}
          </View>

      </TouchableWithoutFeedback>
    );    
  }
  
  const styles = StyleSheet.create({
  
    container: {
      flex: 1,
      backgroundColor: "#fff",
      justifyContent: "center",
    },
    cameraContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "black", // Sfondo per risaltare il video
      overflow: "hidden", // Nasconde contenuti fuori dal contenitore
    },
    webCameraWrapper: {
      width: "100%",
      maxWidth: 800, // Limita la larghezza della webcam
      maxHeight: 600, // Limita l'altezza della webcam
      aspectRatio: 16 / 9, // Mantiene proporzioni 16:9
      overflow: "hidden",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#000", // Per evitare spazi vuoti visibili
    },
    webCamera: {
      width: "100%",
      height: "100%",
      objectFit: "cover", // Assicura che il video si adatti al contenitore
    },
    buttonContainer: {
      position: "absolute",
      bottom: 20,
      left: 0,
      right: 0,
      alignItems: "center",
    },
    takePictureButton: {
      position: "absolute",
    bottom: 40,
    alignSelf: "center",
    backgroundColor: "#E8F0FF",
    borderRadius: 70,
    width: 90,
    height: 90,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
    borderWidth: 3, // Add a white border for contrast
    borderColor: "#FFF",
    },
    buttonText: {
      fontSize: 16,
      color: "#000",
    },
    header: {
      position: "absolute",
      top: 50,
      right: 10,
      zIndex: 1000,
      padding: 10,
    },
    camera: {
      flex: 1,
      width: "100%",
    },
  });
  
  
  
