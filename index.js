import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();

app.use(cors()); 
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Gemini Proxy funcionando 🚀");
});

app.post("/v1/chat/completions", async (req, res) => {
  try {
    const messages = req.body.messages || [];

    const prompt = messages.map(m => m.content).join("\n");

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }]
            }
          ]
        })
      }
    );

    const data = await response.json();

    res.json({
      id: "chatcmpl-proxy",
      object: "chat.completion",
      choices: [
        {
          index: 0,
          message: {
            role: "assistant",
            content:
              data?.candidates?.[0]?.content?.parts?.[0]?.text ||
              "Sin respuesta de Gemini"
          },
          finish_reason: "stop"
        }
      ]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log("Proxy corriendo en puerto", PORT);
});
