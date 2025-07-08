// src/app/AppCheckProvider.tsx
"use client";

import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";
import { useEffect } from "react";
import app from "@/lib/firebase";

export function AppCheckProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window !== "undefined") {
      initializeAppCheck(app, {
        provider: new ReCaptchaV3Provider('6LetZHwrAAAAAN8LNWHuHBQbCzRUIpWrRvPA69uM'), // <-- ЗАМЕНИТЕ ЭТО
        isTokenAutoRefreshEnabled: true,
      });
    }
  }, []);

  return <>{children}</>;
}