export const siteConfig = {
  name: "Admin Dashboard",
  description: "Admin Dashboard",
  mainNav: [
    {
      title: "Home",
      href: "/",
    },
    {
      title: "Admin",
      href: "/admin",
    },
  ],
  links: {
    twitter: "https://twitter.com/shadcn",
    github: "https://github.com/shadcn/ui",
    docs: "https://ui.shadcn.com",
  },
  envConfig: {
  firebase: {
    apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "",
  },
  apiServer: {
  development: process.env.NEXT_PUBLIC_SERVER_URL_DEVELOPMENT || "",
  staging: process.env.NEXT_PUBLIC_SERVER_URL_STAGING || "",
  production: process.env.NEXT_PUBLIC_SERVER_URL_PRODUCTION || "",
},

},

} as const;

export type SiteConfig = typeof siteConfig;
