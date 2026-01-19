app.get("/", (req, res) => {
  res.send("Proxy vivo");
});
import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

app.post("/v1/chat/completions", async (req, res) => {
  try {
    const messages = req.body.messages
      .map(m => m.content)
      .join("\n");

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{ text: messages }]
        }]
      }
    );

    res.json({
      choices: [{
        message: {
          content: response.data.candidates[0].content.parts[0].text
        }
      }]
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Proxy Gemini corriendo en puerto", PORT);
});

