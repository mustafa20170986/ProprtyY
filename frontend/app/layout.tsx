import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "PropertyX - Luxury Real Estate",
  description:
    "Discover, Buy, Sell luxury properties worldwide. Modern real estate platform.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" data-theme="light">
        <head>
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap"
            rel="stylesheet"
          />
          <link
            rel="stylesheet"
            href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          />
        </head>
        <body className="min-h-screen">
          {children}
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
