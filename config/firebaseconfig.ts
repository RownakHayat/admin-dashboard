import { initializeApp, getApp, getApps } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { siteConfig } from "@/config/site"; // adjust path as needed
import { getAuth } from "firebase/auth";

const firebaseConfig = siteConfig.envConfig.firebase;

// Prevent multiple initializations (important in dev with HMR)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Analytics only on client
// const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;
// const app !getApps().length ? initializeApp(firebaseConfig) : getApp()
const auth = getAuth(app)


export { app, auth };
