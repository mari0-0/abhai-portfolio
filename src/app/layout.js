import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-main",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-secondary",
  display: "swap",
  weight: ["400", "500", "600"],
});

export const metadata = {
  title: "Abhai Matta Portfolio",
  description:
    "Full-stack developer and creative technologist building immersive digital experiences at the intersection of design and engineering.",
  icons: {
    icon: "/assets/logo.svg",
  },
};

import LenisProvider from "@/components/LenisProvider";

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <body>
        <LenisProvider>
          <main>{children}</main>
        </LenisProvider>
      </body>
    </html>
  );
}
