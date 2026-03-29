"use client";

import { Search, ChevronDown, Zap, Globe, Clock, ArrowUp } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="flex flex-col h-full bg-[#0A0A0A] text-neutral-300 relative">
      
      {/* HEADER: Search and Avatar */}
      <header className="flex items-center justify-between px-8 py-4 border-b border-neutral-800/60">
        <div className="flex items-center gap-3 text-neutral-500 w-1/3">
          <Search size={16} />
          <input 
            type="text" 
            placeholder="Find anything" 
            className="bg-transparent border-none outline-none text-sm w-full placeholder:text-neutral-600 focus:text-neutral-300 transition-colors"
          />
        </div>
        <div className="flex items-center gap-4">
          <div className="w-7 h-7 rounded-full bg-neutral-700 overflow-hidden shadow-sm">
            {/* Synthetic avatar placeholder */}
            <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Viktor&backgroundColor=e5e5e5" alt="User" className="w-full h-full object-cover mix-blend-luminosity opacity-80" />
          </div>
        </div>
      </header>

      {/* DASHBOARD CONTENT SCROLL AREA */}
      <div className="flex-1 overflow-y-auto px-8 py-10 pb-40">
        
        {/* Page Titles and Actions */}
        <div className="flex justify-between items-end mb-10">
          <div>
            <h1 className="text-3xl font-serif text-white tracking-tight leading-tight">Morning <span className="text-neutral-500">Viktor</span></h1>
            <p className="text-neutral-500 text-sm mt-1">here's a quick look at how things are going.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="flex items-center justify-center p-2 rounded-md border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700 transition-all bg-[#0F0F0F]">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
            </button>
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-neutral-800 text-neutral-300 text-sm font-medium hover:border-neutral-700 transition-all bg-[#0F0F0F]">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
              1 year
              <ChevronDown size={14} className="text-neutral-500 ml-1" />
            </button>
            <div className="flex bg-[#0F0F0F] rounded-md border border-neutral-800 p-0.5">
              <button className="px-4 py-1.5 text-sm font-medium rounded-sm bg-neutral-800/80 text-white shadow-sm">
                Overview
              </button>
              <button className="px-4 py-1.5 text-sm font-medium rounded-sm text-neutral-500 hover:text-neutral-300 transition-colors">
                Metrics
              </button>
            </div>
          </div>
        </div>

        {/* BENTO GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Weekly Summary */}
          <div className="col-span-1 border border-neutral-800/80 bg-[#0F0F0F] rounded-xl p-5 flex flex-col justify-between hover:border-neutral-700 transition-colors">
            <div className="flex justify-between items-start mb-6 w-full">
              <span className="text-xs font-medium text-neutral-500">Weekly Summary</span>
              <span className="text-[10px] text-neutral-600 bg-neutral-900 px-2 py-0.5 rounded-full">Just now</span>
            </div>
            <p className="text-sm text-neutral-300 leading-relaxed mb-8">
              <strong className="text-white font-medium">Revenue $4,200, Expenses $1,800, Net $2,400.</strong> 3 new customers onboarded. Strong week!
            </p>
            <div className="flex justify-between items-center mt-auto pt-4 border-t border-neutral-800/50">
              <button className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-white transition-colors">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
                Listen to breakdown
              </button>
              <button className="text-xs text-neutral-600 hover:text-neutral-400 transition-colors">Dismiss</button>
            </div>
          </div>

          {/* Card 2: Profit Chart Mock */}
          <div className="col-span-1 border border-neutral-800/80 bg-[#0F0F0F] rounded-xl p-5 flex flex-col hover:border-neutral-700 transition-colors">
            <div className="flex items-center gap-2 mb-3">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-500"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
              <h3 className="text-xs font-medium text-neutral-500">Profit</h3>
            </div>
            <p className="text-xs text-neutral-500 mb-6">
              Your average profit <span className="text-neutral-300">during 6 months</span> is <strong className="text-white font-medium">$1,450.50</strong>
            </p>
            {/* CSS Synthetic Bar Chart */}
            <div className="flex items-end gap-2 h-16 mt-auto">
              {[30, 45, 25, 60, 40, 70, 35, 15, 55, 65, 20].map((h, i) => (
                <div key={i} className={`flex-1 ${i % 3 === 0 ? 'bg-white' : 'bg-neutral-800'} rounded-sm opacity-90 hover:opacity-100 transition-opacity`} style={{ height: `${h}%` }}></div>
              ))}
            </div>
            <button className="text-[11px] text-neutral-600 hover:text-neutral-400 mt-4 text-left transition-colors font-medium">See detailed graph</button>
          </div>

          {/* Card 3: Burnrate */}
          <div className="col-span-1 border border-neutral-800/80 bg-[#0F0F0F] rounded-xl p-5 flex flex-col hover:border-neutral-700 transition-colors">
            <div className="flex items-center gap-2 mb-3">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-500"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              <h3 className="text-xs font-medium text-neutral-500">Burnrate & Runway</h3>
            </div>
            <p className="text-xs text-neutral-500 mb-6 leading-relaxed">
              Your current burnrate is <strong className="text-white font-medium">$2,346</strong> & your current runway is
            </p>
            <div className="mt-auto">
              <h2 className="text-2xl font-serif text-white mb-4">9 months</h2>
              <button className="text-[11px] text-neutral-600 hover:text-neutral-400 text-left transition-colors font-medium border-t border-neutral-800/50 pt-3 w-full block">See burnrate</button>
            </div>
          </div>

          {/* Card 4: Files */}
          <div className="col-span-1 border border-neutral-800/80 bg-[#0F0F0F] rounded-xl p-5 flex flex-col hover:border-neutral-700 transition-colors">
            <div className="flex items-center gap-2 mb-3">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-500"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
              <h3 className="text-xs font-medium text-neutral-500">Files</h3>
            </div>
            <p className="text-xs text-neutral-500 mb-6 leading-relaxed">
              <strong className="text-white font-medium">2 new uploaded files</strong>, automatically categorized as <strong className="text-white font-medium">agreements</strong>
            </p>
            <div className="mt-auto">
              <button className="text-[11px] text-neutral-600 hover:text-neutral-400 text-left transition-colors font-medium border-t border-neutral-800/50 pt-3 w-full block">Show documents</button>
            </div>
          </div>

          {/* Card 5: Expenses */}
          <div className="col-span-1 border border-neutral-800/80 bg-[#0F0F0F] rounded-xl p-5 flex flex-col hover:border-neutral-700 transition-colors">
             <div className="flex items-center gap-2 mb-3">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-500"><rect x="2" y="5" width="20" height="14" rx="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>
              <h3 className="text-xs font-medium text-neutral-500">Expenses</h3>
            </div>
            <p className="text-xs text-neutral-500 mb-8">Spending this month</p>
            <div className="mt-auto">
              <h2 className="text-2xl font-serif text-white mb-4">$5,278.50</h2>
              <button className="text-[11px] text-neutral-600 hover:text-neutral-400 text-left transition-colors font-medium border-t border-neutral-800/50 pt-3 w-full block">See biggest cost</button>
            </div>
          </div>

          {/* Card 6: Invoices */}
          <div className="col-span-1 border border-neutral-800/80 bg-[#0F0F0F] rounded-xl p-5 flex flex-col hover:border-neutral-700 transition-colors">
             <div className="flex items-center gap-2 mb-3">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-500"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
              <h3 className="text-xs font-medium text-neutral-500">Invoices</h3>
            </div>
            <p className="text-xs text-neutral-500 mb-6 leading-relaxed">
              You currently have <strong className="text-white font-medium">4 unpaid and $12,500 outstanding in outstanding invoices</strong>
            </p>
            <div className="mt-auto">
              <button className="text-[11px] text-neutral-600 hover:text-neutral-400 text-left transition-colors font-medium border-t border-neutral-800/50 pt-3 w-full block">See unpaid invoices</button>
            </div>
          </div>

          {/* Card 7: Account Balance */}
          <div className="col-span-1 border border-neutral-800/80 bg-[#0F0F0F] rounded-xl p-5 flex flex-col hover:border-neutral-700 transition-colors">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex -space-x-1 grayscale opacity-70">
                <div className="w-4 h-4 rounded-full border border-neutral-900 bg-neutral-300"></div>
                <div className="w-4 h-4 rounded-full border border-neutral-900 bg-neutral-500"></div>
              </div>
            </div>
            <p className="text-xs text-neutral-500 mb-6 leading-relaxed">
              Total account balance is <strong className="text-white font-medium">$24,356</strong> in two different currencies
            </p>
            <div className="mt-auto">
              <button className="text-[11px] text-neutral-600 hover:text-neutral-400 text-left transition-colors font-medium border-t border-neutral-800/50 pt-3 w-full block">See account balances</button>
            </div>
          </div>

          {/* Card 8: Software Trend */}
          <div className="col-span-1 border border-neutral-800/80 bg-[#0F0F0F] rounded-xl p-5 flex flex-col hover:border-neutral-700 transition-colors">
             <div className="flex items-center gap-2 mb-3">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-500"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line></svg>
              <h3 className="text-xs font-medium text-neutral-500">Software</h3>
              <ChevronDown size={10} className="text-neutral-600" />
            </div>
            <p className="text-xs text-neutral-500 mb-4 leading-relaxed">
              Your <strong className="text-white font-medium">software costs increased by 10%</strong> this month
            </p>
            <div className="mt-auto relative h-12 w-full flex items-end mb-2 border-b border-neutral-800">
               {/* Pure SVG Line Chart Sparkline */}
               <svg className="absolute bottom-0 w-full h-[30px]" preserveAspectRatio="none" viewBox="0 0 100 30" fill="none" stroke="currentColor" strokeWidth="2">
                 <path className="text-neutral-400 brightness-150" d="M0,25 L15,22 L30,26 L45,20 L60,10 L75,15 L90,5 L100,8" strokeLinecap="round" strokeLinejoin="round"/>
               </svg>
            </div>
            <button className="text-[11px] text-neutral-600 hover:text-neutral-400 text-left transition-colors font-medium border-t border-neutral-800/50 pt-3 w-full block">See which subscriptions went up?</button>
          </div>

        </div>
      </div>

      {/* FLOAT COMMAND PROMPT BOTTOM AREA */}
      <div className="absolute bottom-0 left-0 right-0 w-full px-8 pb-8 pt-12 bg-linear-to-t from-[#0A0A0A] via-[#0A0A0A]/95 to-transparent z-10 pointer-events-none">
        
        <div className="max-w-4xl mx-auto w-full flex flex-col gap-4 pointer-events-auto">
          
          {/* Preset Chips */}
          <div className="flex items-center justify-center gap-2 mb-2 flex-wrap text-[#0A0A0A]">
            {['Revenue', 'Duplicate invoice', 'Expenses', 'Time track'].map((tag, i) => (
              <button key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-400 text-[10px] uppercase tracking-wider font-medium hover:bg-neutral-800 hover:text-white transition-colors cursor-pointer">
                {tag === 'Revenue' && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>}
                {tag === 'Duplicate invoice' && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path></svg>}
                {tag === 'Expenses' && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>}
                {tag === 'Time track' && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>}
                {tag}
              </button>
            ))}
          </div>

          {/* Preset Prompts List */}
          <div className="flex flex-col rounded-lg bg-neutral-900/50 border border-neutral-800/80 divide-y divide-neutral-800 overflow-hidden shadow-2xl backdrop-blur-xl">
            <button className="text-left px-5 py-3 text-[13px] text-neutral-400 hover:bg-neutral-800/50 transition-colors">
              <strong className="text-white font-medium">I want to</strong> know what changed in my cash flow this week
            </button>
            <button className="text-left px-5 py-3 text-[13px] text-neutral-400 hover:bg-neutral-800/50 transition-colors">
              <strong className="text-white font-medium">I want to</strong> see which customers haven't paid yet
            </button>
            <button className="text-left px-5 py-3 text-[13px] text-neutral-400 hover:bg-neutral-800/50 transition-colors">
              <strong className="text-white font-medium">I want to</strong> understand where we spent more than usual this month
            </button>
            
            {/* Input Bar */}
            <div className="relative flex items-center bg-neutral-900 border-t border-neutral-800 p-2">
              <input 
                type="text" 
                placeholder="I want to..." 
                className="w-full bg-transparent border-none outline-none text-[13px] text-white placeholder:text-neutral-500 pl-3 pr-24 py-2 font-medium" 
              />
              <div className="absolute right-2 flex items-center gap-1.5">
                <button className="p-1.5 text-neutral-500 hover:text-white hover:bg-neutral-800 rounded transition-colors" title="Attach">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>
                </button>
                <button className="p-1.5 text-neutral-500 hover:text-white hover:bg-neutral-800 rounded transition-colors" title="Actions">
                  <Zap size={14} />
                </button>
                <button className="p-1.5 text-neutral-500 hover:text-white hover:bg-neutral-800 rounded transition-colors" title="Browse">
                  <Globe size={14} />
                </button>
                <button className="p-1.5 text-neutral-500 hover:text-white hover:bg-neutral-800 rounded transition-colors mr-1" title="History">
                  <Clock size={14} />
                </button>
                <button className="bg-white hover:bg-neutral-200 text-black p-1.5 rounded transition-colors shadow-sm" title="Submit">
                  <ArrowUp size={16} />
                </button>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
