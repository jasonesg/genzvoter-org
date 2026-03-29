export const metadata = {
  title: "Dashboard | GenZVoter",
};

export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen bg-[#0A0A0A] text-neutral-300 font-sans overflow-hidden">
      
      {/* LEFT SIDEBAR NAVIGATION */}
      <aside className="w-16 h-full border-r border-neutral-800/60 flex flex-col items-center py-4 shrink-0 bg-[#0c0c0c]">
        {/* Top Logo (Starburst) */}
        <div className="w-8 h-8 flex items-center justify-center text-neutral-400 hover:text-white transition-colors cursor-pointer mb-8">
          <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="12 2 12 6"></polyline><polyline points="12 18 12 22"></polyline><polyline points="4.93 4.93 7.76 7.76"></polyline><polyline points="16.24 16.24 19.07 19.07"></polyline><polyline points="2 12 6 12"></polyline><polyline points="18 12 22 12"></polyline><polyline points="4.93 19.07 7.76 16.24"></polyline><polyline points="16.24 7.76 19.07 4.93"></polyline>
          </svg>
        </div>

        {/* Navigation Icons Flow */}
        <nav className="flex-1 flex flex-col items-center gap-6 w-full">
          {/* Active Item (Dashboard / Squares) */}
          <div className="relative flex items-center justify-center w-full group cursor-pointer">
            <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-white rounded-r"></div>
            <div className="p-2 bg-neutral-800 rounded-md text-white">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect>
              </svg>
            </div>
          </div>
          
          {/* Inactive Items */}
          {[
            // Chart
            <path key="1" d="M18 20V10M12 20V4M6 20v-6"></path>,
            // Book
            <path key="2" d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 4h16v15a2 2 0 0 1-2 2H6.5A2.5 2.5 0 0 1 4 19.5z"></path>,
            // Inbox
            <path key="3" d="M22 12h-4l-3 9L9 3l-3 9H2"></path>, // Pulse/Activity (using as a placeholder since exact match is hard)
            // Stopwatch
            <path key="4" d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 6v6l4 2"></path>,
            // File text
            <path key="5" d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8"></path>,
            // Nodes/Share
            <path key="6" d="M4 12v8M20 12v8M12 4v16M8 8h8M8 16h8"></path>,
            // Briefcase
            <path key="7" d="M22 12h-4l-3 9L9 3l-3 9H2"></path>, // Mocks
            // Settings Grid
            <path key="8" d="M3 3h18v18H3zM3 9h18M3 15h18M9 3v18M15 3v18"></path>,
            // Settings Cog
            <path key="9" d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
          ].map((pathChildren, index) => (
            <div key={index} className="p-2 text-neutral-500 hover:text-neutral-300 transition-colors cursor-pointer">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {pathChildren}
                {index === 8 && <circle cx="12" cy="12" r="3"></circle>}
              </svg>
            </div>
          ))}
        </nav>

        {/* Bottom Org Logo */}
        <div className="mt-auto pt-4">
          <div className="w-8 h-8 flex items-center justify-center bg-neutral-800 rounded-sm text-[10px] text-neutral-400 font-medium tracking-tighter cursor-pointer">
            Acme
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col h-full overflow-y-auto overflow-x-hidden relative bg-[#0A0A0A]">
        {children}
      </main>
      
    </div>
  );
}
