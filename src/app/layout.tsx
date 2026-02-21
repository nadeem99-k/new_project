import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "StudyAI — AI Tutor for Pakistani Students",
  description:
    "Get instant AI-powered help on your textbook questions in Urdu and English. Supports Punjab Board, Federal Board, Sindh Board, and Cambridge curriculum.",
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#1a1a35",
              color: "#f1f5f9",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "0.75rem",
            },
          }}
        />
      </body>
    </html>
  );
}
