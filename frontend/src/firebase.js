// Mock/Stub Firebase Configuration
// Replace with actual Firebase config from Firebase Console
import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase only if valid API key is present
const app = firebaseConfig.apiKey !== "YOUR_API_KEY" ? initializeApp(firebaseConfig) : null;
const auth = app ? getAuth(app) : null;

// Stub functions if Firebase is not configured
export const setupRecaptcha = (containerId) => {
  if (auth) {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
        size: 'invisible',
        callback: (response) => {
          console.log("Recaptcha solved");
        }
      });
    }
  } else {
    console.warn("Firebase not configured. Mocking Recaptcha.");
    window.recaptchaVerifier = { mock: true };
  }
};

export const requestPhoneOtp = async (phoneNumber) => {
  if (auth) {
    const appVerifier = window.recaptchaVerifier;
    return await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
  } else {
    console.warn("Firebase not configured. Returning mock confirmation result.");
    return {
      confirm: async (otp) => {
        if (otp === "123456") {
          return {
            user: {
              getIdToken: async () => "mock_firebase_token_mock_user_123"
            }
          };
        }
        throw new Error("Invalid Mock OTP. Use 123456");
      }
    };
  }
};

export { auth };
