const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { SpeechClient } = require("@google-cloud/speech");
const client = new SpeechClient();
require("dotenv").config();

// Set up express app
const app = express();
const port = 3000;

// Set up multer to handle file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Create uploads directory if it doesn't exist
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

// Handle file upload and transcription
app.post("/transcribe", upload.single("audio"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No audio file uploaded" });
    }

    const audioFilePath = path.join(__dirname, req.file.path);
    const audio = fs.readFileSync(audioFilePath);
    const audioBytes = audio.toString("base64");

    const request = {
      audio: { content: audioBytes },
      config: {
        encoding: "LINEAR16",
        sampleRateHertz: 16000,
        languageCode: "en-US",
      },
    };

    const [response] = await client.recognize(request);
    const transcription = response.results
      .map((result) => result.alternatives[0].transcript)
      .join("\n");

    fs.unlinkSync(audioFilePath); // Clean up the uploaded file

    res.json({ transcription });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on http://192.168.100.60:${port}`);
});
