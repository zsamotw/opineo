import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { AuthProvider } from "@/src/context/AuthContext";
import { OpinionsProvider } from "@/src/context/OpinionsContext";
import { ThemeProvider } from "@/src/components/ThemeProvider";
import { Navbar } from "@/src/components/Navbar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Opineo",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pl"
      className={`${geistSans.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <AuthProvider>
            <Navbar />
            <OpinionsProvider>{children}</OpinionsProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
