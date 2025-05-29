import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { ReduxStoreProvider } from "./providers/reduxStoreProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SMEF",
  description: "Small and Medium Enterprise Foundation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <ReduxStoreProvider>
        {children}
        <Toaster />
      </ReduxStoreProvider>
      </body>
    </html>
  );
}
