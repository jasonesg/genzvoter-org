import { Inter } from "next/font/google";
import "./globals.css";
import { PageTransition } from "@/components/PageTransition";
import { Header } from "@/components/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "GenZVoter",
  description: "Empowering the next generation.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <div className="relative min-h-screen flex flex-col pt-16 selection:bg-primary-500/30">
          {/* Default Dark Background with faint noise or mesh gradient simulation */}
          <div className="fixed inset-0 z-[-1] bg-black bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-neutral-900/30 via-black to-black"></div>
          
          <Header />
          
          <main className="flex-1">
            <PageTransition>{children}</PageTransition>
          </main>
          
          <footer className="border-t border-white/10 py-12 text-center text-sm text-neutral-500">
            © {new Date().getFullYear()} GenZVoter. All rights reserved.
          </footer>
        </div>
      </body>
    </html>
  );
}
