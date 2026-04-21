import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

app.post("/process", async (req, res) => {
  const { message, phone } = req.body;

  try {
    const aiResponse = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "Você é um assistente útil e objetivo." },
          { role: "user", content: message }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
        }
      }
    );

    const text = aiResponse.data.choices[0].message.content;

    await axios.post(
      f"{process.env.WHATSAPP_URL}/message/sendText",
      {
        "number": phone,
        "text": text
      },
      {
        headers: {
          "apikey": process.env.WHATSAPP_API_KEY
        }
      }
    );

    res.json({ success: True, response: text });

  } catch (error) {
    res.status(500).json({ error: "Erro no fluxo" });
  }
});

app.listen(3000, () => console.log("Server ON"));
