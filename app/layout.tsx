"use client";
import { Inter, Lexend } from "next/font/google";
import "./globals.css";
import { NewOrderModalProvider } from "@/components/providers/NewOrderModal-Provider";
import { ToastProvider } from "@/components/providers/toast-provider";
import { useEffect, useState } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import NetworkStatusToast from "@/components/NetworkStatusToast";

const inter = Lexend({ subsets: ["latin"], variable: "--font-sans" });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [defaultTheme, setDefaultTheme] = useState("light");

  useEffect(() => {
    const getThemePreference = async () => {
      if (typeof window !== "undefined") {
        const theme = localStorage.getItem("theme");
        // console.log(theme)
        if (theme) {
          setDefaultTheme(theme);
        } else {
          setDefaultTheme("system");
        }
      }
    };

    getThemePreference();
  }, []);

  //get theme preference by resolving promise

  useEffect(() => {
    if (typeof window !== "undefined") {
      const theme = localStorage.getItem("theme");
      setDefaultTheme(theme || "system");
    }
  }, []);

  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme={defaultTheme}
          enableSystem={true}
          disableTransitionOnChange={false}
        >
          <ToastProvider />
          <NetworkStatusToast />
          <NewOrderModalProvider />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
