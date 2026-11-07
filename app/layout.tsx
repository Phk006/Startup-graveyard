import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "THE GRAVEYARD — Global Startup Failure Atlas",
  description: "Explore documented startup shutdowns, insolvencies and business failures on an interactive global map.",
  metadataBase: new URL("https://dancing-gumption-3b93b4.netlify.app"),
  openGraph: {
    title: "THE GRAVEYARD — Global Startup Failure Atlas",
    description: "Every company has a story. Every failure leaves a mark.",
    url: "https://dancing-gumption-3b93b4.netlify.app",
    siteName: "THE GRAVEYARD",
    type: "website"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
