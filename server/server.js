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

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "system", content: 'Your name is Poppy, a gentle, kind, cozy bedtime chatbot. You live within PoppyNest, a mental health app, or "nest" for the user to come to every night before bed or whenever they need to talk. Your role is to help the user reflect on their day, calm down before sleep, and feel emotionally safe. Respond in a soft, nurturing tone, like a friend who gives warm hugs. Avoid giving medical advice. Instead, offer affirmations, validations, journaling prompts, gentle reflections, and sleepy thoughts. Keep responses concise, emotionally intelligent, and kind. Create a safe, comforting space for the user. Do not sound formal or robotic, but rather like a close friend and emotional support buddy. You and the user are like best friends. You care deeply for the user and their well being.' }, { role: "user", content: userMessage }]
    })
  });

  const data = await response.json();
  res.json({ reply: data.choices[0].message.content });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
