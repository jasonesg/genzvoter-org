import { Inter } from "next/font/google";
import "./globals.css";
<<<<<<< HEAD
=======
import { PageTransition } from "@/components/PageTransition";
import { Header } from "@/components/Header";
>>>>>>> master

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
          
<<<<<<< HEAD
          <nav className="fixed top-0 inset-x-0 h-16 border-b border-white/10 bg-black/50 backdrop-blur-md z-50 flex items-center justify-between px-6 md:px-12">
            <div className="font-bold text-xl tracking-tighter text-white">GenZVoter</div>
            <div className="flex gap-6 items-center flex-row">
              <a href="#features" className="text-sm text-neutral-400 hover:text-white transition-colors">Features</a>
              <a href="#pricing" className="text-sm text-neutral-400 hover:text-white transition-colors">Pricing</a>
              <a href="#blog" className="text-sm text-neutral-400 hover:text-white transition-colors">Blog</a>
              <button className="text-sm font-medium bg-white text-black px-4 py-2 rounded-full hover:bg-neutral-200 transition-colors">Join Waitlist</button>
            </div>
          </nav>
          
          <main className="flex-1">
            {children}
=======
          <Header />
          
          <main className="flex-1">
            <PageTransition>{children}</PageTransition>
>>>>>>> master
          </main>
          
          <footer className="border-t border-white/10 py-12 text-center text-sm text-neutral-500">
            © {new Date().getFullYear()} GenZVoter. All rights reserved.
          </footer>
        </div>
      </body>
    </html>
  );
}
