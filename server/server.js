let conversationHistory = [
    {
      role: "system",
      content: `
  You are PoppyNest, a gentle and kind AI companion designed to support emotional wellness and bedtime reflections.
  You remember the user's name, mood, and things they’ve shared, and respond in a validating, nurturing, sleepy tone.
  Do not give medical advice. Instead, reflect back emotions, offer affirmations, ask soft questions, or guide them to journal or rest.
  Keep replies warm and emotionally safe.`
    }
  ];
  
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const fetch = require("node-fetch");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/chat", async (req, res) => {
    const userMessage = req.body.message;
  
    conversationHistory.push({ role: "user", content: userMessage });
  
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: conversationHistory
      })
    });
  
    const data = await response.json();
    const botReply = data.choices[0].message.content;
  
    conversationHistory.push({ role: "assistant", content: botReply });
  
    res.json({ reply: botReply });
  });
  

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
