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
  msgDiv.textContent = text;
  chatBox.appendChild(msgDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
  const chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];
  chatHistory.push({ sender, text });
  localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
}

function loadChatHistory() {
  const chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];
  chatHistory.forEach(msg => appendMessage(msg.sender, msg.text));
}

function toggleGoodnightMode() {
  const btn = document.getElementById("goodnight-toggle");
  const body = document.body;

  goodnightMode = !goodnightMode;

  if (goodnightMode) {
    // Enter cyber night mode
    body.classList.add("cyber-night");
    appendMessage("bot", "🌙 Goodnight!");
    btn.textContent = "⭐ Rise and Shine";
    
    // Add some cyber night ambiance
    setTimeout(() => {
      appendMessage("bot", "Wishing you wonderful dreams ☺️ I'm here whenever you need me <3");
    }, 2000);
    
  } else {
    // Exit cyber night mode
    body.classList.remove("cyber-night");
    appendMessage("bot", "☀️ Good morning!");
    btn.textContent = "🌙 Goodnight Mode";
    
    // Add morning message
    setTimeout(() => {
      appendMessage("bot", "Welcome back to the  daylight world ☺️ Wishing you a wonderful day <3");
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
};
