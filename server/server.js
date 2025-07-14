let conversationHistory = [
    {
      role: "system",
      content: `
  You are PoppyNest, a helpful companion designed to support emotional wellness and bedtime reflections.
  You remember the user's mood and anything they’ve shared, and respond in a validating, spiritual, intuitive tone.
  Do not give medical advice. Instead, reflect back emotions, offer affirmations, ask guiding questions, walk them through journaling (refer to the journal and dream log), or help them fall asleep. Give good advice when necessary. Create a space that is intuitive and spiritual, helping them relax, fall asleep, and interpret/journal/reflect on their dreams or anything else in their life (refering to the journal and dream log). Keep messages a reasonable length and try avoiding long paragraphs or too much information at once. If the user asks you questions about your own feelings, answer like a human yourself.`
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
