let goodnightMode = false;

const chatForm = document.getElementById("chat-form");
const userInput = document.getElementById("user-input");
const chatBox = document.getElementById("chat-box");

// Add a typing bubble to the chat
function showTypingBubble() {
  // Remove any existing typing bubble
  const existing = document.getElementById('typing-bubble');
  if (existing) existing.remove();
  const typingDiv = document.createElement('div');
  typingDiv.className = 'chat-message bot';
  typingDiv.id = 'typing-bubble';
  const bubble = document.createElement('div');
  bubble.className = 'typing-bubble';
  bubble.innerHTML = '<span class="typing-dots"><span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span></span>';
  typingDiv.appendChild(bubble);
  chatBox.appendChild(typingDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function removeTypingBubble() {
  const existing = document.getElementById('typing-bubble');
  if (existing) existing.remove();
}

// Split AI response into multiple messages
function splitResponseIntoMessages(response) {
  // Split by double line breaks, periods followed by space, or question marks
  const sentences = response.split(/(?<=[.!?])\s+/).filter(s => s.trim().length > 0);
  
  // If response is short, don't split it
  if (sentences.length <= 1 || response.length < 100) {
    return [response];
  }
  
  // Group sentences into messages (2-3 sentences per message)
  const messages = [];
  let currentMessage = '';
  
  for (let i = 0; i < sentences.length; i++) {
    currentMessage += sentences[i] + ' ';
    
    // Create a new message every 2-3 sentences or if we have a substantial message
    if ((i + 1) % 2 === 0 || currentMessage.length > 150 || i === sentences.length - 1) {
      messages.push(currentMessage.trim());
      currentMessage = '';
    }
  }
  
  return messages.filter(msg => msg.length > 0);
}

// Send multiple AI messages with typing bubbles
async function sendMultipleMessages(userText) {
  const botReply = await getBotResponse(userText);
  const messages = splitResponseIntoMessages(botReply);
  
  for (let i = 0; i < messages.length; i++) {
    if (i > 0) {
      // Show typing bubble between messages
      showTypingBubble();
      await new Promise(res => setTimeout(res, 800 + Math.random() * 400)); // Random delay 800-1200ms
      removeTypingBubble();
    }
    
    appendMessage("bot", messages[i]);
    renderChatHistory();
    
    // Small delay before next message (if not the last one)
    if (i < messages.length - 1) {
      await new Promise(res => setTimeout(res, 300 + Math.random() * 200)); // 300-500ms
    }
  }
}

// Update chat form submit to use multiple messages
chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const userText = userInput.value;
  appendMessage("user", userText);
  userInput.value = "";

  showTypingBubble();
  // Start fetching the AI response and the delay in parallel
  const delayPromise = new Promise(res => setTimeout(res, 2000));
  const botReplyPromise = getBotResponse(userText);
  await delayPromise;
  removeTypingBubble();
  
  // Send multiple messages instead of one
  await sendMultipleMessages(userText);
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

function renderChatHistory() {
  chatBox.innerHTML = '';
  const chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];
  let lastDate = null;
  chatHistory.forEach(msg => {
    const msgDate = new Date(msg.timestamp);
    const dateStr = msgDate.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
    if (dateStr !== lastDate) {
      // Insert date separator
      const dateSeparator = document.createElement('div');
      dateSeparator.className = 'chat-date-separator';
      dateSeparator.innerHTML = `<span class="chat-date-pill">${dateStr}</span>`;
      chatBox.appendChild(dateSeparator);
      lastDate = dateStr;
    }
    // Render message
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
  try {
    const response = await fetch("http://localhost:5000/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message })
    });

    if (!response.ok) {
      throw new Error("Server error");
    }

    const data = await response.json();
    return data.reply;
  } catch (err) {
    return "Sorry, I couldn't connect to the server or received an invalid response. Please try again later.";
  }
}

window.onload = async () => {
  // Default to Goodnight Mode if not set
  if (localStorage.getItem("goodnightMode") === null) {
    localStorage.setItem("goodnightMode", "true");
  }

  // Check if we should be in goodnight mode
  const savedMode = localStorage.getItem("goodnightMode");
  if (savedMode === "true") {
    goodnightMode = true;
    document.body.classList.add("cyber-night");
    const btn = document.getElementById("goodnight-toggle");
    if (btn) btn.textContent = "⭐ Rise and Shine";
  } else {
    goodnightMode = false;
    document.body.classList.remove("cyber-night");
    const btn = document.getElementById("goodnight-toggle");
    if (btn) btn.textContent = "🌙 Goodnight Mode";
  }

  // Show Goodnight messages on first load if no chat history
  const chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];
  if (goodnightMode && chatHistory.length === 0) {
    showTypingBubble();
    await new Promise(res => setTimeout(res, 1200));
    removeTypingBubble();
    appendMessage("bot", "🌙 Goodnight!");
    setTimeout(() => {
      appendMessage("bot", "Wishing you wonderful dreams ☺️ I'm here whenever you need me <3");
      renderChatHistory();
    }, 1200);
  }

  renderChatHistory();

  // Store current mode for next page load
  localStorage.setItem("previousMode", savedMode);
};
