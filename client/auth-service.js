import { auth, db } from './firebase-config.js';

class AuthService {
  constructor() {
    this.currentUser = null;
    this.currentUsername = null;
    this.authStateListener = null;
    this.initAuthStateListener();
  }

  // Initialize auth state listener
  initAuthStateListener() {
    this.authStateListener = auth.onAuthStateChanged(async (user) => {
      this.currentUser = user;
      if (user) {
        // Load username from Firestore
        const userDoc = await db.collection('users').doc(user.uid).get();
        this.currentUsername = userDoc.exists ? userDoc.data().username : user.email;
      } else {
        this.currentUsername = null;
      }
      this.onAuthStateChanged(user);
    });
  }

  // Callback for auth state changes
  async onAuthStateChanged(user) {
    if (user) {
      this.showAuthenticatedUI();
      // Removed: do not show goodnight greeting here
      await this.loadUserChatHistory();
    } else {
      this.showLoginUI();
      const loginForm = document.getElementById('login-form');
      const registerForm = document.getElementById('register-form');
      if (loginForm) loginForm.style.display = 'block';
      if (registerForm) registerForm.style.display = 'none';
    }
  }

  // Register new user
  async register(email, password, username) {
    try {
      const userCredential = await auth.createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;
      // Create user profile in Firestore
      await db.collection('users').doc(user.uid).set({
        email: email,
        username: username,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        lastSeen: firebase.firestore.FieldValue.serverTimestamp()
      });
      this.currentUsername = username;
      return { success: true, user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Login user
  async login(email, password) {
    try {
      const userCredential = await auth.signInWithEmailAndPassword(email, password);
      const user = userCredential.user;
      // Update last seen
      await db.collection('users').doc(user.uid).update({
        lastSeen: firebase.firestore.FieldValue.serverTimestamp()
      });
      // Load username
      const userDoc = await db.collection('users').doc(user.uid).get();
      this.currentUsername = userDoc.exists ? userDoc.data().username : user.email;
      return { success: true, user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Logout user
  async logout() {
    try {
      await auth.signOut();
      this.currentUsername = null;
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Get current user
  getCurrentUser() {
    return this.currentUser;
  }

  // Get current username
  getCurrentUsername() {
    return this.currentUsername || (this.currentUser ? this.currentUser.email : '');
  }

  // Check if user is authenticated
  isAuthenticated() {
    return this.currentUser !== null;
  }

  // Save chat message to Firestore (append to a single document for the user)
  async saveChatMessage(message) {
    if (!this.currentUser) return;
    try {
      // Use a single document to store all chat history as an array
      const chatRef = db.collection('users').doc(this.currentUser.uid).collection('meta').doc('chatHistory');
      await db.runTransaction(async (transaction) => {
        const doc = await transaction.get(chatRef);
        let history = [];
        if (doc.exists) {
          history = doc.data().messages || [];
        }
        history.push(message);
        transaction.set(chatRef, { messages: history });
      });
    } catch (error) {
      this.saveToLocalStorage(message);
    }
  }

  // Load chat history from Firestore and update localStorage
  async loadUserChatHistory() {
    if (!this.currentUser) return [];
    try {
      // Load from the single chatHistory document
      const chatRef = db.collection('users').doc(this.currentUser.uid).collection('meta').doc('chatHistory');
      const doc = await chatRef.get();
      let messages = [];
      if (doc.exists) {
        messages = doc.data().messages || [];
      }
      // Save to localStorage for offline use
      localStorage.setItem('chatHistory', JSON.stringify(messages));
      return messages;
    } catch (error) {
      return this.loadFromLocalStorage();
    }
  }

  // Fallback to localStorage
  saveToLocalStorage(message) {
    const chatHistory = JSON.parse(localStorage.getItem(`chatHistory_${this.currentUser?.uid}`)) || [];
    chatHistory.push(message);
    localStorage.setItem(`chatHistory_${this.currentUser?.uid}`, JSON.stringify(chatHistory));
  }

  loadFromLocalStorage() {
    return JSON.parse(localStorage.getItem(`chatHistory_${this.currentUser?.uid}`)) || [];
  }

  // UI Methods
  showAuthenticatedUI() {
    const loginContainer = document.getElementById('login-container');
    const chatContainer = document.getElementById('chat-container');
    const userInfo = document.getElementById('user-info');
    if (loginContainer) loginContainer.style.display = 'none';
    if (chatContainer) chatContainer.style.display = 'block';
    if (userInfo) {
      userInfo.textContent = `Welcome, ${this.getCurrentUsername()}`;
      userInfo.style.display = 'block';
    }
  }

  showLoginUI() {
    const loginContainer = document.getElementById('login-container');
    const chatContainer = document.getElementById('chat-container');
    const userInfo = document.getElementById('user-info');
    if (loginContainer) loginContainer.style.display = 'flex';
    if (chatContainer) chatContainer.style.display = 'none';
    if (userInfo) userInfo.style.display = 'none';
  }
}

// Remove global showGoodnightGreeting function

export default AuthService; 