import { db } from './firebase-config.js';
import AuthService from './auth-service.js';

const authService = new AuthService();

// --- Journal ---
export async function saveJournalPages(pages) {
  if (authService.isAuthenticated()) {
    const userId = authService.getCurrentUser().uid;
    await db.collection('users').doc(userId).collection('meta').doc('journalPages').set({ pages });
  } else {
    localStorage.setItem('journalPages', JSON.stringify(pages));
  }
}

export async function loadJournalPages() {
  if (authService.isAuthenticated()) {
    const userId = authService.getCurrentUser().uid;
    const doc = await db.collection('users').doc(userId).collection('meta').doc('journalPages').get();
    if (doc.exists) {
      return doc.data().pages || [];
    }
    return [];
  } else {
    const saved = localStorage.getItem('journalPages');
    return saved ? JSON.parse(saved) : [];
  }
}

// --- Dream Log ---
export async function saveDreamPages(pages) {
  if (authService.isAuthenticated()) {
    const userId = authService.getCurrentUser().uid;
    await db.collection('users').doc(userId).collection('meta').doc('dreamPages').set({ pages });
  } else {
    localStorage.setItem('dreamPages', JSON.stringify(pages));
  }
}

export async function loadDreamPages() {
  if (authService.isAuthenticated()) {
    const userId = authService.getCurrentUser().uid;
    const doc = await db.collection('users').doc(userId).collection('meta').doc('dreamPages').get();
    if (doc.exists) {
      return doc.data().pages || [];
    }
    return [];
  } else {
    const saved = localStorage.getItem('dreamPages');
    return saved ? JSON.parse(saved) : [];
  }
} 