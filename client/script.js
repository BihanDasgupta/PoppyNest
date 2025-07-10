let goodnightMode = false;

const chatForm = document.getElementById("chat-form");
const userInput = document.getElementById("user-input");
const chatBox = document.getElementById("chat-box");

chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const userText = userInput.value;
  appendMessage("user", userText);
  userInput.value = "";

  const botReply = await getBotResponse(userText);
  appendMessage("bot", botReply);
});

function appendMessage(sender, text) {
  const msgDiv = document.createElement("div");
  msgDiv.classList.add("chat-message", sender);
  
  // Create message bubble
  const bubble = document.createElement("div");
  bubble.classList.add("message-bubble");
  bubble.textContent = text;
  
  // Create timestamp
  const timestamp = document.createElement("div");
  timestamp.classList.add("timestamp");
  const now = new Date();
  timestamp.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  // Add bubble and timestamp to message div
  msgDiv.appendChild(bubble);
  msgDiv.appendChild(timestamp);
  
  chatBox.appendChild(msgDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
  
  // Save to localStorage
  const chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];
  chatHistory.push({ sender, text, timestamp: now.toISOString() });
  localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
}

function loadChatHistory() {
  const chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];
  chatHistory.forEach(msg => {
    const msgDiv = document.createElement("div");
    msgDiv.classList.add("chat-message", msg.sender);
    
    const bubble = document.createElement("div");
    bubble.classList.add("message-bubble");
    bubble.textContent = msg.text;
    
    const timestamp = document.createElement("div");
    timestamp.classList.add("timestamp");
    const msgTime = new Date(msg.timestamp);
    timestamp.textContent = msgTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    msgDiv.appendChild(bubble);
    msgDiv.appendChild(timestamp);
    chatBox.appendChild(msgDiv);
  });
  chatBox.scrollTop = chatBox.scrollHeight;
}

function toggleGoodnightMode() {
  const btn = document.getElementById("goodnight-toggle");
  const body = document.body;

  goodnightMode = !goodnightMode;

  if (goodnightMode) {
    // Enter cyber night mode
    body.classList.add("cyber-night");
    localStorage.setItem("goodnightMode", "true");
    appendMessage("bot", "🌙 Goodnight!");
    btn.textContent = "⭐ Rise and Shine";
    
    // Add some cyber night ambiance
    setTimeout(() => {
      appendMessage("bot", "Wishing you wonderful dreams ☺️ I'm here whenever you need me <3");
    }, 2000);
    
  } else {
    // Exit cyber night mode
    body.classList.remove("cyber-night");
    localStorage.setItem("goodnightMode", "false");
    appendMessage("bot", "☀️ Good morning!");
    btn.textContent = "🌙 Goodnight Mode";
    
    // Add morning message
    setTimeout(() => {
      appendMessage("bot", "Welcome back to the daylight world ☺️ Wishing you a wonderful day <3");
    }, 1500);
  }
}

async function getBotResponse(message) {
  const response = await fetch("http://localhost:5000/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ message })
  });

  const data = await response.json();
  return data.reply;
}

window.onload = () => {
  loadChatHistory();
  
  // Check if we should be in goodnight mode
  const savedMode = localStorage.getItem("goodnightMode");
  const previousMode = localStorage.getItem("previousMode") || "false";
  
  if (savedMode === "true") {
    goodnightMode = true;
    document.body.classList.add("cyber-night");
    const btn = document.getElementById("goodnight-toggle");
    if (btn) btn.textContent = "⭐ Rise and Shine";
    
    // Check if mode was changed on another page
    if (previousMode === "false") {
      appendMessage("bot", "🌙 Goodnight!");
      setTimeout(() => {
        appendMessage("bot", "Wishing you wonderful dreams ☺️ I'm here whenever you need me <3");
      }, 2000);
    }
  } else {
    goodnightMode = false;
    document.body.classList.remove("cyber-night");
    const btn = document.getElementById("goodnight-toggle");
    if (btn) btn.textContent = "🌙 Goodnight Mode";
    
    // Check if mode was changed on another page
    if (previousMode === "true") {
      appendMessage("bot", "☀️ Good morning!");
      setTimeout(() => {
        appendMessage("bot", "Welcome back to the daylight world ☺️ Wishing you a wonderful day <3");
      }, 1500);
    }
  }
  
  // Store current mode for next page load
  localStorage.setItem("previousMode", savedMode);
};
