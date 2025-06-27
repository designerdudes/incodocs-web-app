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
  const [defaultTheme, setDefaultTheme] = useState("system"); // Default to "system" for SSR
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const theme = localStorage.getItem("theme") || "system";
    setDefaultTheme(theme);
  }, []);

  //get theme preference by resolving promise

  // Render nothing or a fallback during SSR to avoid mismatches
  if (!isClient) {
    return (
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
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

  return (
    <html lang="en" suppressHydrationWarning>
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
