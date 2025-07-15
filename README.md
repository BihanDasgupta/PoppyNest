# 🌸 PoppyNest

**Meet PoppyNest**, a cozy mental health and bedtime app designed to help you relax/unwind before bed.
---
## 🔗 Website Link: https://incandescent-tulumba-87dcf5.netlify.app/
---

## 💤 Features

- 💡 **Saved Data**  
  Log-in system with email ensures that all your data is saved on any device.
  
- 🌙 **AI Bedtime Chatbot**  
  Talk to a gentle, comforting chatbot about anything on your mind — stress, your day, or your dreams.

- 💖 **Emotional Memory**  
  PoppyNest remembers the conversation context and adjusts responses based on your tone and history.

- 📓 **Journal Page**  
  Write about your day, reflect on your feelings, or record anything that's on your mind through time/date-stamped entries. You can always edit, revisit or delete them as needed.

- 🛌 **Dream Log**  
  Keep track of your dreams over time through time/date-stamped entries. You can always edit, revisit, or delete them as needed.

- ✏️ **Drawing Mode**  
  Relaxingly doodle in Rise and Shine Mode (white canvas with pastel colors) or Goodnight Mode (black canvas with neon colors). Drawing entries are saved, date/time-stamped, and can be edited, revisited, deleted, or saved to your device as needed. 

- ⭐ **Rise and Shine Mode**  
  Light mode ~ Switch the UI to soft, light pastel colors. The chatbot will auto-greet you with morning messages.

- 🌘 **Goodnight Mode**  
  Dark mode ~ Switch the UI to a sleepy, neon cyber moonlit theme. The chatbot will auto-greet you with goodnight messages.

- 🎀 **Pastel/Cyber Design**  
  Soft pastel + Neon Cyber UI designed to be calm, cozy, and sleep-friendly yet give an illuminating nighttime vibe.

---

## ⚙️ Tech Stack

- **Frontend**: HTML, CSS, JavaScript
- **Framework**: [Vite](https://vitejs.dev/)
- **Backend**: Node.js with Express
- **AI Chat**: OpenAI API (via server)
- **Database & Auth**: Firebase
- **Deployment**: Netlify

---

## 🧠 Prompt Engineering

PoppyNest uses prompt engineering to create an emotionally supportive tone in the chatbot responses. The AI assistant is instructed to:

- Be gentle, empathetic, and kind
- Prioritize mental well-being
- Adapt responses based on user conversations over time

---



---


## 📦 Project Structure

PoppyNest/
│
├── client/ # Frontend source
│ ├── index.html
│ ├── script.js
│ ├── style.css
│ ├── journal.html
│ ├── dreams.html
│ ├── firebase-config.js
│ ├── .env # VITE_ prefixed Firebase + OpenAI keys
│ └── vite.config.js
│
├── server/ # Express server to handle OpenAI API calls
│ ├── server.js
│ └── .env # OPENAI_API_KEY
│
├── netlify.toml # Netlify deployment config
├── package.json
└── README.md
