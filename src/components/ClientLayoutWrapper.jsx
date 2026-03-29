"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/Header";
import { PageTransition } from "@/components/PageTransition";

export function ClientLayoutWrapper({ children }) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/get-started";
  const isDashboard = pathname.startsWith("/dashboard");
  const isDesignerDash = pathname === "/designer-dashboard";

  if (isAuthPage || isDashboard || isDesignerDash) {
    return (
      <div className="relative h-screen flex flex-col bg-black selection:bg-primary-500/30">
        <main className="flex-1 h-full">
          <PageTransition>{children}</PageTransition>
        </main>
      </div>
    );
  }

  return (
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
  );
}
