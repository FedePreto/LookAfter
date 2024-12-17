const express = require("express");
const multer = require("multer");
const fetch = require("node-fetch");
require("dotenv").config(); // Carica le variabili d'ambiente dal file .env

const app = express();
const port = process.env.PORT || 4000;

// Configura multer per salvare il file audio direttamente in memoria
const upload = multer({ storage: multer.memoryStorage() });

// Endpoint per la trascrizione usando Google Speech-to-Text API con API Key
app.post("/speech-to-text", upload.single("audio"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Nessun file audio caricato" });
    }

    // Converte il file audio in base64
    const audioBase64 = req.file.buffer.toString("base64");

    // Configura il corpo della richiesta per Google Speech-to-Text
    const requestBody = {
      audio: {
        content: audioBase64,
      },
      config: {
        encoding: "LINEAR16", // Cambia in base al formato del tuo audio
        languageCode: "it-IT", // Lingua italiana
        sampleRateHertz: 16000, // Assicurati che corrisponda al tuo file audio
      },
    };

    // Invia la richiesta a Google Speech-to-Text API
    const response = await fetch(
      `https://speech.googleapis.com/v1/speech:recognize?key=${process.env.GOOGLE_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      }
    );

    const data = await response.json();

    if (data.error) {
      console.error("Errore API Google:", data.error);
      return res.status(500).json({ error: data.error.message });
    }

    // Estrae la trascrizione dalla risposta
    const transcription = data.results
      ?.map((result) => result.alternatives[0].transcript)
      .join("\n");

    console.log("Transcription:", transcription);
    res.json({ transcription: transcription || "Nessun testo rilevato." });
  } catch (error) {
    console.error("Errore durante la trascrizione:", error.message);
    res.status(500).json({ error: "Errore durante la trascrizione audio" });
  }
});

// Avvia il server
app.listen(port, () => {
  console.log(`Server in esecuzione su http://localhost:${port}`);
});
