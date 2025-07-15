# 🌸 PoppyNest

**Meet PoppyNest**, a cozy mental health and bedtime app designed to help you relax/unwind before bed.
---
## 🔗 Website Link: [\https://incandescent-tulumba-87dcf5.netlify.app/](https://incandescent-tulumba-87dcf5.netlify.app/)
---

## ⚙️ Tech Stack

- **Frontend**: HTML, CSS, JavaScript
- **Framework**: [Vite](https://vitejs.dev/)
- **Backend**: Node.js with Express
- **AI Chat**: OpenAI API (via server)
- **Database & Auth**: Firebase
- **Deployment**: Netlify

---

## 💤 Features

- 💡 **Saved Data**  
  Log-in system with email ensures that all your data is saved on any device.
  
- 🌙 **AI Bedtime Chatbot**  
  Talk to a gentle, comforting chatbot about anything on your mind — stress, your day, or your dreams. The chatbot can be used for emotional support, advice, journal prompts/walkthroughs, dream interpretation, and help falling asleep.

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

## 🧠 Prompt Engineering

PoppyNest uses prompt engineering to create an emotionally supportive tone in the chatbot responses. The AI assistant is instructed to:

- Be gentle, empathetic, and kind
- Prioritize mental well-being
- Adapt responses based on user conversations over time

---

## 🌱 Future Implementations

This is just the beginning. Planned features include:

- 🧘‍♀️ **Mood Tracker & Daily Check-In**  
  Let users log how they feel with emojis or words and track their emotional health over time.

- 🔔 **Bedtime Reminders**  
  Let users schedule gentle push notifications to open PoppyNest nightly.

- 🛏️ **Bedtime Stories or Affirmation Narration**  
  Add AI-generated bedtime stories or gentle voice affirmations (Text-to-Speech).

- ☁️ **Further Dream Analysis**  
  Use NLP to better interpret or reflect on dream content with symbolic prompts.

- 🗂️ **Multi-Journal Views**  
  Let users organize by day, emotion, or keyword — like a gentle mental health diary.

- 🧬 **Dream vs Nightmare Analytics**  
  Use AI and algorithms to keep track of and analyze the types of dreams vs nightmares the user reports having. Create a dashboard with these reports and respective insight on what these patterns could mean.

- 📱 **Native App Support**  
  Package as a PWA or native iOS/Android app with Capacitor or React Native.
  
- 🚧 **Phone Authentication + Verification System** 
  Add feature for logging in with phone number as well as phone & email verification system to better protect data.

- 🪷 **Personal AI Growth**  
  Better installed long-term memory to remember the user’s themes, growth patterns, and journaling goals. Can be done through feeding more user data beyond chats, an LLM stack beyond just OpenAI, and perhaps even an LLM API with internet access (i.e. Perplexity).

---

## 🛠️ To Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/your-username/poppynest.git
cd poppynest
```

### 2. Set up environment variables

- In `/client/.env`:

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id
```

- In `/server/.env`:

```env
OPENAI_API_KEY=your-openai-api-key
```

### 3. Install dependencies

```bash
# Frontend
cd client
npm install

# Backend
cd ../server
npm install
```

### 4. Start the app

```bash
# Terminal 1 (backend)
cd server
node server.js

# Terminal 2 (frontend)
cd client
npm run dev
```

Then visit `http://localhost:3000` in your browser ✨

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

---

## ⚠️ Disclaimer

PoppyNest is a wellness companion intended to support reflection, emotional awareness, and relaxation.  
**It is not a substitute for medical, psychological, or psychiatric advice or treatment.**  
If you are experiencing a mental health crisis, please seek help from a licensed professional or contact a crisis line in your area.

---

## 🙏 Credits

Made with love by **Bihan Dasgupta** 💖  

