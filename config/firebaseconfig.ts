import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { siteConfig } from "@/config/site"; // adjust path as needed

// Use Firebase config from siteConfig
const firebaseConfig = siteConfig.envConfig.firebase;

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics only in browser environment
const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;

export { app, analytics };
