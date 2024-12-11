import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView } from 'react-native';

export default function PreviewConfirmationDavid({ route, navigation }) {
  const { images } = route.params || {}; // Receive images array from CameraScreen

  const __retakePicture = () => {
    navigation.goBack(); // Go back to CameraScreen
  };

  const __chooseArtwork = () => {
    navigation.navigate('ArtworkReachedDavid', { images }); 
    //navigation.navigate('AnotherArtworkReached', { images }); 
    //navigation.navigate('LostPage', { images });
  };
  const isMultipleImages = Array.isArray(images);

  return (
    <View style={styles.container}>
      
      {isMultipleImages ? (
        // Multiple Images - Display in a horizontal scroll
        <ScrollView
          horizontal
          pagingEnabled
          contentContainerStyle={styles.imageContainer}
        >
          {images.map((uri, index) => (
            <View key={index} style={styles.imageWrapper}>
              <Image source={{ uri }} style={styles.image} />
            </View>
          ))}
        </ScrollView>
      ) : images ? (
        // Single Image - Display directly
        <Image source={{ uri: images }} style={styles.image} />
      ) : (
        // No Images
        <Text style={styles.noImagesText}>No images captured</Text>
      )}
      <Text style={styles.text}>Does the image looks Good?</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={__retakePicture} style={styles.button}>
          <Text style={styles.textButton}>Re-Take</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={__chooseArtwork} style={styles.button}>
          <Text style={styles.textButton}>Proceed</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  imageContainer: {
    flexDirection: 'row', // Arrange images horizontally
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageWrapper: {
    width: 300, // Match image width for paging
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 300,
    height: 400,
    marginHorizontal: 10,
    borderRadius: 10,
  },
  noImagesText: {
    fontSize: 18,
    color: 'gray',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    position: 'absolute',
    bottom: 50,
  },
  button: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 10,
    width: 120,
    alignItems: 'center',
  },
  textButton: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
