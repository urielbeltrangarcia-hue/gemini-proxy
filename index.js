import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Gemini Proxy funcionando 🚀");
});

app.post("/v1/chat/completions", async (req, res) => {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: req.body.messages[0].content }]
            }
          ]
        })
      }
    );

    const data = await response.json();

    res.json({
      choices: [
        {
          message: {
            content:
              data?.candidates?.[0]?.content?.parts?.[0]?.text ||
              "Sin respuesta de Gemini"
          }
        }
      ]
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log("Proxy corriendo en puerto", PORT);
});
