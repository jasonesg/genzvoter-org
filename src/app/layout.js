import { Inter, Alegreya } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { ClientLayoutWrapper } from "@/components/ClientLayoutWrapper";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const alegreya = Alegreya({ subsets: ["latin"], variable: "--font-playfair", weight: ["400", "500", "700", "800"] });

export const metadata = {
  title: "Houdys",
  description: "Find your next home.",
};

const GA_ID = "G-0M0FBQBZR9";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${alegreya.variable} ${inter.className}`}>
        {/* Google tag (gtag.js) */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}');
          `}
        </Script>

        <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
      </body>
    </html>
  );
}
