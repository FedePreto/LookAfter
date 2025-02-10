import { Audio } from "expo-av";
import { useRef, useState } from "react";
import { Platform } from "react-native";
import * as FileSystem from "expo-file-system";
import * as Device from "expo-device";


export const readBlobAsBase64 = async (blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onload = () => resolve(reader.result.split("base64,")[1]); //reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

export const recordSpeech = async (audioRecordingRef, setIsRecording) => {
  try {

    await Audio.setAudioModeAsync({//per IOS
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });

    if (audioRecordingRef.current?._isDoneRecording) {
      audioRecordingRef.current = new Audio.Recording();
    }

    let permissionResponse = await Audio.requestPermissionsAsync();
    console.log("Audio Permission:", permissionResponse);

    if (permissionResponse.status !== "granted") {
      console.error("Permessi microfono negati.");
      return;
    }
    setIsRecording(true);
    audioRecordingRef.current = new Audio.Recording();

    const recordingOptions = {
      ...Audio.RecordingOptionsPresets.HIGH_QUALITY,
      android: {
        extension: ".amr",
        outputFormat: Audio.AndroidOutputFormat.AMR_WB,
        audioEncoder: Audio.AndroidAudioEncoder.AMR_WB,
        sampleRate: 16000,
        numberOfChannels: 1,
        bitRate: 128000,
      },
      ios: {
        extension: ".wav",
        audioQuality: Audio.IOSAudioQuality.HIGH,
        sampleRate: 44100,
        numberOfChannels: 1,
        bitRate: 128000,
        linearPCMBitDepth: 16,
        linearPCMIsBigEndian: false,
        linearPCMIsFloat: false,
      }
    };

      await audioRecordingRef.current.prepareToRecordAsync(recordingOptions);
      console.log("Registrazione pronta!");
      await audioRecordingRef.current.startAsync();
      console.log("Registrazione avviata!");
    
  } catch (err) {
    console.error("Errore nella registrazione:", err);
  }
};

export const transcribeSpeech = async (audioRecordingRef) => {
  try {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: false,
    });

    if (!audioRecordingRef.current?._canRecord) {
      console.error("Registrazione non pronta");
      return;
    }

    await audioRecordingRef.current.stopAndUnloadAsync();
    console.log("Registrazione fermata!");

    const recordingUri = audioRecordingRef.current.getURI();
    let base64Uri = "";

    if (Platform.OS === "web") {
      const blob = await fetch(recordingUri).then((res) => res.blob());
      base64Uri = await readBlobAsBase64(blob);
    } else {
      base64Uri = await FileSystem.readAsStringAsync(recordingUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
    }

    
    console.log("Base64 Audio:", base64Uri.substring(0, 100)); // Mostra solo i primi 100 caratteri


    const audioConfig = {
      encoding: Platform.OS === "android" ? "AMR_WB" : Platform.OS === "web" ? "WEBM_OPUS" : "LINEAR16",
      sampleRateHertz: Platform.OS === "android" ? 16000 : Platform.OS === "web" ? 48000 : 41000,
      languageCode: "it-IT",
    };

    //const rootOrigin = Platform.OS === "android" ? "10.0.2.2" : Device.isDevice ? process.env.LOCAL_DEV_IP || "localhost" : "localhost";
    //const rootOrigin = process.env.LOCAL_DEV_IP;
    //const serverUrl = `http://localhost:4000/speech-to-text`;


    //------------------------------------------------------
    const rootOrigin = ""; //insert here your local IP address
    const serverUrl = `http://${rootOrigin}:4000/speech-to-text`;
    //------------------------------------------------------
    

    console.log("Server URL:", serverUrl);

    const response = await fetch(serverUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ audioUrl: base64Uri, config: audioConfig }),
    });

    const serverResponse = await response.json();
    return serverResponse?.results?.[0]?.alternatives?.[0]?.transcript || "";
  } catch (e) {
    console.error("Errore nella trascrizione:", e);
  }
};

