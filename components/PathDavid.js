import React from 'react';
import { StyleSheet, Text, View,Image, TouchableOpacity } from 'react-native';

export default function PathDavid({ navigation }) {
  const handleProceed = () => {
    navigation.navigate('ConfirmArtworkDavid'); // Replace 'NextScreen' with the actual screen name
  };

  return (
    <View style={styles.container}>
        {/* Header Section */}
      <View style={styles.header}>
        <Image
          source={require('../assets/david.png')} // Replace with actual image URI
          style={styles.headerImage}
        />
        <View style={styles.headerIcons}>
          <Image
            source={{ uri: 'https://via.placeholder.com/30' }} // Replace with actual icon URI
            style={styles.icon}
          />
          <Image
            source={{ uri: 'https://via.placeholder.com/30' }} // Replace with actual icon URI
            style={styles.icon}
          />
        </View>
      </View>
      {/*main Content */}
      <View style={styles.content}>
      <Text style={styles.description}>
        2 FOOTS FORWARD TO REACH THE MOST ICONIC SCULPTURE". "THE MONALISA"
      </Text>
      <Text style={styles.description}>
        1 FOOTS ON THE RIGHT ONCE "MONALISA" HAS BEEN REACHED
      </Text>
      </View>

      {/* Process button  */}
      <TouchableOpacity onPress={handleProceed} style={styles.proceedButton}>
        <Text style={styles.buttonText}>Proceed</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      padding: 20,
    },
    description: {
        fontSize: 30,
        color: '#333',
        textAlign: 'center', // Center-align the text horizontally
        marginBottom: 20, // Adds space above the button
      },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    headerImage: {
      width: 70,
      height: 70,
      flexDirection: 'row',
      alignItems: 'center',
    },
    headerIcons: {
      flexDirection: 'row',
    },
    icon: {
      width: 30,
      height: 30,
      marginLeft: 10,
    },
    content: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    text: {
      fontSize: 18,
      color: '#d32f2f',
      textAlign: 'center',
      marginBottom: 20,
      fontWeight: 'bold',
    },
    proceedButton: {
      position: 'absolute',
      bottom: 30,
      right: 20,
      backgroundColor: '#d32f2f',
      paddingVertical: 15,
      paddingHorizontal: 30,
      borderRadius: 10,
    },
    buttonText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
    },
  });
