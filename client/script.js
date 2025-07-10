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
}

function sayGoodnight() {
  appendMessage("bot", "Goodnight 🌸 Sweet dreams. I'm here whenever you need me.");
  document.body.style.backgroundColor = "#fce4ec"; // soft pink
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
