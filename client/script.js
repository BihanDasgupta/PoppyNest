import './firebase-config.js';
import './auth-service.js';
import AuthService from './auth-service.js';

let goodnightMode = false;
let authService = new AuthService();
let currentTheme = 'pink'; // Default theme

const chatForm = document.getElementById("chat-form");
const userInput = document.getElementById("user-input");
const chatBox = document.getElementById("chat-box");
const goodnightToggle = document.getElementById("goodnight-toggle");

// Authentication form elements
const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");
const showRegisterLink = document.getElementById("show-register");
const showLoginLink = document.getElementById("show-login");
const authError = document.getElementById("auth-error");

// Theme elements
const themeButtons = document.getElementById("theme-buttons");

// Make appendMessage globally accessible for goodnight greeting
window.appendMessage = appendMessage;

// Theme Management Functions
function initThemeSystem() {
  // Add event listeners to theme buttons
  const themeBtns = document.querySelectorAll('.theme-btn');
  themeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const theme = btn.getAttribute('data-theme');
      setTheme(theme);
    });
  });
}

function setTheme(theme) {
  currentTheme = theme;
  
  // Remove all existing theme classes
  document.documentElement.removeAttribute('data-theme');
  
  // Add new theme class
  document.documentElement.setAttribute('data-theme', theme);
  
  // Save theme for current user
  if (authService.isAuthenticated()) {
    const user = authService.getCurrentUser();
    if (user) {
      authService.saveUserTheme(user.uid, theme);
    }
  }
  
  // Add visual feedback
  const clickedBtn = document.querySelector(`[data-theme="${theme}"]`);
  if (clickedBtn) {
    clickedBtn.style.transform = 'scale(1.3)';
    setTimeout(() => {
      clickedBtn.style.transform = 'scale(1)';
    }, 200);
  }
}

async function loadUserTheme() {
  if (authService.isAuthenticated()) {
    const user = authService.getCurrentUser();
    if (user) {
      const savedTheme = await authService.getUserTheme(user.uid);
      if (savedTheme && savedTheme !== 'pink') {
        setTheme(savedTheme);
      } else {
        // Default to pink theme
        setTheme('pink');
      }
    }
  } else {
    // Not logged in, use default pink theme
    setTheme('pink');
  }
}

function showThemeButtons() {
  if (themeButtons) {
    themeButtons.style.display = 'block';
  }
}

function hideThemeButtons() {
  if (themeButtons) {
    themeButtons.style.display = 'none';
  }
}

// Make theme functions global so they can be called from auth-service.js
window.showThemeButtons = showThemeButtons;
window.hideThemeButtons = hideThemeButtons;

// Attach Goodnight Mode toggle event
function attachGoodnightToggle() {
  if (goodnightToggle) {
    goodnightToggle.onclick = toggleGoodnightMode;
  }
}

// Show/hide loading screen
function showLoadingScreen() {
  const loadingScreen = document.getElementById('loading-screen');
  if (loadingScreen) loadingScreen.style.display = 'flex';
  if (loginForm) loginForm.closest('.login-container').style.display = 'none';
  const chatContainer = document.getElementById('chat-container');
  if (chatContainer) chatContainer.style.display = 'none';
}
function hideLoadingScreen() {
  const loadingScreen = document.getElementById('loading-screen');
  if (loadingScreen) loadingScreen.style.display = 'none';
}

function scrollToBottom() {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      chatBox.scrollTop = chatBox.scrollHeight;
    });
  });
}

// Remove loading screen logic
// Only show/hide login and chat containers based on authentication state
async function handleAuthStateChange() {
  if (authService.isAuthenticated()) {
    await authService.loadUserChatHistory();
    await renderChatHistory();
    document.getElementById('chat-container').style.display = 'block';
    document.getElementById('login-container').style.display = 'none';
    showThemeButtons(); // Show theme buttons when logged in
    await loadUserTheme(); // Load user's saved theme
    scrollToBottom(); // Call after display change
  } else {
    await renderChatHistory();
    document.getElementById('chat-container').style.display = 'none';
    document.getElementById('login-container').style.display = 'flex';
    hideThemeButtons(); // Hide theme buttons when logged out
    setTheme('pink'); // Reset to default pink theme
  }
}

// Initialize nightlamp
function initNightlamp() {
  const nightlamp = document.getElementById('nightlamp');
  const lightOverlay = document.getElementById('lightOverlay');
  let isLampOn = false;

  // Load saved state
  const savedLampState = localStorage.getItem('nightlampOn');
  if (savedLampState === 'true') {
    isLampOn = true;
    nightlamp.classList.add('on');
    lightOverlay.classList.add('active');
  }

  nightlamp.addEventListener('click', () => {
    isLampOn = !isLampOn;
    
    if (isLampOn) {
      nightlamp.classList.add('on');
      lightOverlay.classList.add('active');
      localStorage.setItem('nightlampOn', 'true');
      
      // Add a subtle sound effect (optional)
      if (window.speechSynthesis) {
        const utterance = new SpeechSynthesisUtterance('click');
        utterance.volume = 0.1;
        utterance.rate = 3;
        speechSynthesis.speak(utterance);
      }
    } else {
      nightlamp.classList.remove('on');
      lightOverlay.classList.remove('active');
      localStorage.setItem('nightlampOn', 'false');
    }
  });

  // Add hover effect with subtle glow
  nightlamp.addEventListener('mouseenter', () => {
    if (!isLampOn) {
      nightlamp.style.filter = 'brightness(1.1)';
    }
  });

  nightlamp.addEventListener('mouseleave', () => {
    if (!isLampOn) {
      nightlamp.style.filter = 'brightness(1)';
    }
  });
}

// Initialize interactive title
function initInteractiveTitle() {
  const letters = document.querySelectorAll('.interactive-title .letter');
  
  letters.forEach(letter => {
    letter.addEventListener('mouseenter', (e) => {
      // Add floating particles effect
      createFloatingParticles(e.target);
      
      // Add sound effect (optional - browser compatibility)
      if (window.speechSynthesis) {
        const utterance = new SpeechSynthesisUtterance(letter.textContent);
        utterance.volume = 0.1;
        utterance.rate = 2;
        speechSynthesis.speak(utterance);
      }
    });
    
    letter.addEventListener('mouseleave', () => {
      // Remove any lingering effects
    });
  });
}

// Create floating particles around the letter
function createFloatingParticles(letterElement) {
  const rect = letterElement.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  
  for (let i = 0; i < 5; i++) {
    const particle = document.createElement('div');
    particle.className = 'floating-particle';
    particle.style.cssText = `
      position: fixed;
      left: ${centerX}px;
      top: ${centerY}px;
      width: 4px;
      height: 4px;
      background: #ff1493;
      border-radius: 50%;
      pointer-events: none;
      z-index: 1000;
      animation: particleFloat 1s ease-out forwards;
    `;
    
    document.body.appendChild(particle);
    
    // Remove particle after animation
    setTimeout(() => {
      if (particle.parentNode) {
        particle.parentNode.removeChild(particle);
      }
    }, 1000);
  }
}

// Initialize authentication UI
function initAuthUI() {
  // Show/hide register form
  showRegisterLink.addEventListener("click", (e) => {
    e.preventDefault();
    loginForm.style.display = "none";
    registerForm.style.display = "block";
    hideAuthError();
  });

  // Show/hide login form
  showLoginLink.addEventListener("click", (e) => {
    e.preventDefault();
    registerForm.style.display = "none";
    loginForm.style.display = "block";
    hideAuthError();
  });

  // Handle login form submission
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;
    const result = await authService.login(email, password);
    if (!result.success) {
      showAuthError(result.error);
    } else {
      attachGoodnightToggle();
      await handleAuthStateChange();
    }
  });

  // Handle register form submission
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("register-username").value;
    const email = document.getElementById("register-email").value;
    const password = document.getElementById("register-password").value;
    const confirmPassword = document.getElementById("register-confirm-password").value;
    if (password !== confirmPassword) {
      showAuthError("Passwords don't match");
      return;
    }
    const result = await authService.register(email, password, username);
    if (!result.success) {
      showAuthError(result.error);
    } else {
      attachGoodnightToggle();
      await handleAuthStateChange();
    }
  });
}

// Show authentication error
function showAuthError(message) {
  authError.textContent = message;
  authError.style.display = "block";
}

// Hide authentication error
function hideAuthError() {
  authError.style.display = "none";
}

// Logout function
window.logout = async () => {
  const result = await authService.logout();
  if (result.success) {
    // Clear local chat history
    localStorage.removeItem("chatHistory");
    chatBox.innerHTML = "";
    // Reset UI to show login form and hide register form
    if (loginForm) loginForm.style.display = "block";
    if (registerForm) registerForm.style.display = "none";
    document.getElementById('login-container').style.display = 'flex';
    document.getElementById('chat-container').style.display = 'none';
    document.body.classList.add("cyber-night"); // Always return to goodnight mode on logout
    goodnightMode = true;
    const btn = document.getElementById("goodnight-toggle");
    if (btn) btn.textContent = "⭐ Rise and Shine";
    await handleAuthStateChange();
  }
};

// Add a typing bubble to the chat (always at the bottom)
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
  chatBox.appendChild(typingDiv); // Always append at the end
  chatBox.scrollTop = chatBox.scrollHeight;
}

function removeTypingBubble() {
  const existing = document.getElementById('typing-bubble');
  if (existing) existing.remove();
}

// Split AI response into multiple messages
function splitResponseIntoMessages(response) {
  const sentences = response.split(/(?<=[.!?])\s+/).filter(s => s.trim().length > 0);
  if (sentences.length <= 1 || response.length < 100) {
    return [response];
  }
  const messages = [];
  let currentMessage = '';
  for (let i = 0; i < sentences.length; i++) {
    currentMessage += sentences[i] + ' ';
    if ((i + 1) % 2 === 0 || currentMessage.length > 150 || i === sentences.length - 1) {
      messages.push(currentMessage.trim());
      currentMessage = '';
    }
  }
  return messages.filter(msg => msg.length > 0);
}

function calculateTypingDelay(message) {
  const charCount = message.length;
  const wordsPerMinute = 200;
  const charsPerMinute = wordsPerMinute * 5;
  const baseDelay = (charCount / charsPerMinute) * 60 * 1000;
  const minDelay = 800;
  const maxDelay = 4000;
  const randomFactor = 0.7 + Math.random() * 0.6;
  return Math.min(Math.max(baseDelay * randomFactor, minDelay), maxDelay);
}

async function sendMultipleMessages(userText) {
  const botReply = await getBotResponse(userText);
  const messages = splitResponseIntoMessages(botReply);
  for (let i = 0; i < messages.length; i++) {
    if (i > 0) {
      showTypingBubble();
      const typingDelay = calculateTypingDelay(messages[i]);
      await new Promise(res => setTimeout(res, typingDelay));
      removeTypingBubble();
    }
    appendMessage("bot", messages[i]);
    await renderChatHistory();
    if (i > 0 && i < messages.length - 1) {
      await new Promise(res => setTimeout(res, 300 + Math.random() * 200));
    }
  }
}

chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const userText = userInput.value; // Save before clearing!
  appendMessage("user", userText);
  userInput.value = "";
  await renderChatHistory(); // Ensure user's message is rendered before typing bubble
  showTypingBubble();
  const delayPromise = new Promise(res => setTimeout(res, 2000));
  await delayPromise;
  removeTypingBubble();
  await sendMultipleMessages(userText); // Pass the saved text!
});

function appendMessage(sender, text) {
  const msgDiv = document.createElement("div");
  msgDiv.classList.add("chat-message", sender);
  const bubble = document.createElement("div");
  bubble.classList.add("message-bubble");
  bubble.textContent = text;
  const timestamp = document.createElement("div");
  timestamp.classList.add("timestamp");
  const now = new Date();
  timestamp.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  msgDiv.appendChild(bubble);
  msgDiv.appendChild(timestamp);
  chatBox.appendChild(msgDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
  // Save message to user's account if authenticated
  const message = { sender, text, timestamp: now.toISOString() };
  if (authService.isAuthenticated()) {
    authService.saveChatMessage(message);
  }
  // Also save to localStorage as fallback
  const chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];
  chatHistory.push(message);
  localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
}

async function renderChatHistory() {
  chatBox.innerHTML = '';
  let chatHistory = [];
  if (authService.isAuthenticated()) {
    chatHistory = await authService.loadUserChatHistory();
  } else {
    chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];
  }
  let lastDate = null;
  chatHistory.forEach(msg => {
    const msgDate = new Date(msg.timestamp);
    const dateStr = msgDate.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
    if (dateStr !== lastDate) {
      const dateSeparator = document.createElement('div');
      dateSeparator.className = 'chat-date-separator';
      dateSeparator.innerHTML = `<span class="chat-date-pill">${dateStr}</span>`;
      chatBox.appendChild(dateSeparator);
      lastDate = dateStr;
    }
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
  scrollToBottom();
}

// Remove any code that triggers appendMessage with the default messages on page load or auth state change
// Only show goodnight/morning messages when toggling the mode

function toggleGoodnightMode() {
  const btn = document.getElementById("goodnight-toggle");
  const body = document.body;
  goodnightMode = !goodnightMode;
  if (goodnightMode) {
    body.classList.add("cyber-night");
    localStorage.setItem("goodnightMode", "true");
    appendMessage("bot", "🌙 Goodnight!");
    btn.textContent = "⭐ Rise and Shine";
    setTimeout(() => {
      appendMessage("bot", "Wishing you wonderful dreams ☺️ I'm here whenever you need me <3");
    }, 2000);
  } else {
    body.classList.remove("cyber-night");
    localStorage.setItem("goodnightMode", "false");
    appendMessage("bot", "☀️ Good morning!");
    btn.textContent = "🌙 Goodnight Mode";
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
  initAuthUI();
  initInteractiveTitle();
  initNightlamp();
  attachGoodnightToggle();
  initThemeSystem(); // Initialize theme system
  
  if (localStorage.getItem("goodnightMode") === null) {
    localStorage.setItem("goodnightMode", "true");
  }
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
  
  await handleAuthStateChange(); // This will handle theme loading and button visibility
  localStorage.setItem("previousMode", savedMode);
};
