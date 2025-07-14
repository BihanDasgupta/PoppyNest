# Firebase Setup Guide for PoppyNest

This guide will help you set up Firebase authentication and database for your PoppyNest mobile app.

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter a project name (e.g., "poppynest-app")
4. Choose whether to enable Google Analytics (optional)
5. Click "Create project"

## Step 2: Enable Authentication

1. In your Firebase project, go to "Authentication" in the left sidebar
2. Click "Get started"
3. Go to the "Sign-in method" tab
4. Enable "Email/Password" authentication:
   - Click on "Email/Password"
   - Toggle "Enable"
   - Click "Save"

## Step 3: Set Up Firestore Database

1. In your Firebase project, go to "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location for your database (choose the closest to your users)
5. Click "Done"

## Step 4: Get Your Firebase Configuration

1. In your Firebase project, click the gear icon (⚙️) next to "Project Overview"
2. Select "Project settings"
3. Scroll down to "Your apps" section
4. Click the web icon (</>)
5. Register your app with a nickname (e.g., "PoppyNest Web")
6. Copy the configuration object

## Step 5: Update Your Configuration

1. Open `client/firebase-config.js`
2. Replace the placeholder values with your actual Firebase configuration:

```javascript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

## Step 6: Set Up Firestore Security Rules

1. In Firestore Database, go to the "Rules" tab
2. Replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // Users can access their own chat history
      match /chatHistory/{document} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

3. Click "Publish"

## Step 7: Install Dependencies

Run this command in your project root:

```bash
npm install
```

## Step 8: Test the Setup

1. Start your development server: `npm start`
2. Open the app in your browser
3. Try creating a new account
4. Test logging in and out
5. Send some chat messages to verify they're saved

## Features Included

✅ **User Authentication**
- Email/password registration and login
- Secure session management
- Automatic login persistence

✅ **Chat Storage**
- Messages saved to user's Firestore account
- Real-time synchronization
- Offline support with localStorage fallback

✅ **Security**
- User data isolation (users can only access their own data)
- Secure authentication tokens
- Input validation

✅ **Mobile Ready**
- Responsive design
- Touch-friendly interface
- Capacitor integration ready

## Troubleshooting

**Common Issues:**

1. **"Firebase not defined" error**
   - Make sure Firebase SDK scripts are loaded before your app scripts
   - Check that the Firebase configuration is correct

2. **Authentication errors**
   - Verify Email/Password authentication is enabled in Firebase Console
   - Check that your Firebase configuration is correct

3. **Database permission errors**
   - Ensure Firestore security rules are published
   - Check that users are properly authenticated

4. **CORS errors**
   - Add your domain to Firebase Console > Authentication > Settings > Authorized domains

## Next Steps for Mobile App

1. **Install Capacitor plugins:**
   ```bash
   npm install @capacitor/core @capacitor/cli
   npx cap init
   npx cap add android
   npx cap add ios
   ```

2. **Add Firebase plugins:**
   ```bash
   npm install @capacitor-firebase/authentication @capacitor-firebase/firestore
   ```

3. **Build and sync:**
   ```bash
   npm run build
   npx cap sync
   ```

## Security Notes

- Never commit your Firebase API keys to public repositories
- Use environment variables for production
- Regularly review and update Firestore security rules
- Enable additional authentication methods as needed (Google, Apple, etc.)

## Support

If you encounter issues:
1. Check the Firebase Console for error logs
2. Review browser console for JavaScript errors
3. Verify all configuration steps were completed
4. Test with a fresh browser session 