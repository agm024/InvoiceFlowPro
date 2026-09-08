const fs = require('fs');
let page = fs.readFileSync('app/page.tsx', 'utf8');

const targetMockup = `<div className="relative z-10 mt-20 w-full max-w-5xl mx-auto">
               <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-transparent dark:from-blue-500/20 blur-2xl -z-10 rounded-3xl"></div>
               <div className="bg-white/70 dark:bg-[#18181b]/70 backdrop-blur-2xl border border-zinc-200/50 dark:border-zinc-800/80 rounded-2xl shadow-2xl p-4 md:p-6 ring-1 ring-black/5 dark:ring-white/5">
                  <div className="flex items-center gap-2 mb-6 px-2">
                    <div className="w-3 h-3 rounded-full bg-red-400/80"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-400/80"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400/80"></div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
                     <div className="col-span-1 hidden md:flex flex-col gap-2 border-r border-zinc-200/50 dark:border-zinc-800/50 pr-4">
                       <div className="h-8 w-8 rounded-lg bg-blue-600 mb-6"></div>
                       <div className="h-8 w-full rounded-md bg-zinc-100 dark:bg-zinc-800/50"></div>
                       <div className="h-8 w-full rounded-md bg-transparent"></div>
                       <div className="h-8 w-full rounded-md bg-transparent"></div>
                     </div>
                     <div className="col-span-1 md:col-span-3 flex flex-col gap-6">
                       <div className="grid grid-cols-3 gap-4">
                          <div className="p-4 rounded-xl border border-zinc-200/50 dark:border-zinc-800/50 bg-white/50 dark:bg-zinc-900/50">
                             <div className="text-xs font-medium text-zinc-500 mb-1">Revenue</div>
                             <div className="text-2xl font-bold tracking-tight">₹45,231</div>
                          </div>
                          <div className="p-4 rounded-xl border border-zinc-200/50 dark:border-zinc-800/50 bg-white/50 dark:bg-zinc-900/50">
                             <div className="text-xs font-medium text-zinc-500 mb-1">Paid</div>
                             <div className="text-2xl font-bold tracking-tight text-green-500">₹32,100</div>
                          </div>
                          <div className="p-4 rounded-xl border border-zinc-200/50 dark:border-zinc-800/50 bg-white/50 dark:bg-zinc-900/50">
                             <div className="text-xs font-medium text-zinc-500 mb-1">Pending</div>
                             <div className="text-2xl font-bold tracking-tight text-amber-500">₹13,131</div>
                          </div>
                       </div>
                       <div className="h-48 w-full rounded-xl border border-zinc-200/50 dark:border-zinc-800/50 bg-white/50 dark:bg-zinc-900/50 p-4 flex items-end gap-2">
                          {/* Mock Chart Bars */}
                          <div className="w-full bg-blue-500/20 dark:bg-blue-500/10 rounded-t-sm h-1/3"></div>
                          <div className="w-full bg-blue-500/40 dark:bg-blue-500/30 rounded-t-sm h-2/3"></div>
                          <div className="w-full bg-blue-500/60 dark:bg-blue-500/50 rounded-t-sm h-1/2"></div>
                          <div className="w-full bg-blue-500/80 dark:bg-blue-500/70 rounded-t-sm h-full"></div>
                          <div className="w-full bg-blue-500 rounded-t-sm h-3/4"></div>
                       </div>
                     </div>
                  </div>
               </div>
            </div>`;

const newMockup = `<div className="relative z-10 mt-20 w-full max-w-5xl mx-auto text-left">
               <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-transparent dark:from-blue-500/20 blur-2xl -z-10 rounded-3xl"></div>
               <div className="bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden ring-1 ring-black/5 dark:ring-white/5 flex h-[500px]">
                  
                  {/* Sidebar Mockup */}
                  <div className="w-64 border-r border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 p-4 hidden md:flex flex-col h-full shrink-0">
                    <div className="h-10 flex items-center mb-6 px-2">
                      <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center mr-2"></div>
                      <span className="font-bold tracking-tight">InvoiceFlow</span>
                    </div>
                    
                    <div className="w-full bg-blue-600 rounded-xl h-10 mb-6 flex items-center justify-center text-white text-sm font-semibold shadow-sm">
                      + New Invoice
                    </div>

                    <div className="space-y-6">
                      <div>
                        <div className="px-2 text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">Overview</div>
                        <div className="h-8 rounded-lg bg-zinc-200/50 dark:bg-zinc-800 mb-1"></div>
                        <div className="h-8 rounded-lg bg-transparent mb-1"></div>
                      </div>
                      <div>
                        <div className="px-2 text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">Sales</div>
                        <div className="h-8 rounded-lg bg-transparent mb-1"></div>
                        <div className="h-8 rounded-lg bg-transparent mb-1"></div>
                        <div className="h-8 rounded-lg bg-transparent mb-1"></div>
                      </div>
                    </div>
                  </div>

                  {/* Main Content Mockup */}
                  <div className="flex-1 p-6 md:p-8 bg-white dark:bg-[#09090b] flex flex-col h-full overflow-hidden">
                    <div className="flex justify-between items-center mb-8">
                      <div>
                        <h1 className="text-2xl font-extrabold tracking-tight">Your Financial Overview</h1>
                        <p className="text-zinc-500 text-sm mt-1">Monitor real-time transactions and business health.</p>
                      </div>
                      <div className="hidden sm:flex bg-zinc-100 dark:bg-zinc-900 p-1 rounded-lg">
                        <div className="px-3 py-1.5 rounded-md bg-white dark:bg-zinc-800 shadow-sm text-xs font-semibold">This Month</div>
                        <div className="px-3 py-1.5 rounded-md text-zinc-500 text-xs font-semibold">This Year</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                      <div className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                         <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Collected Revenue</div>
                         <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400">₹45,231</div>
                      </div>
                      <div className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                         <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Pending Revenue</div>
                         <div className="text-3xl font-black text-amber-500">₹13,131</div>
                      </div>
                      <div className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                         <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Invoices Issued</div>
                         <div className="text-3xl font-black">24</div>
                      </div>
                    </div>

                    <div className="flex-1 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 flex flex-col justify-end gap-2 overflow-hidden">
                      <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-auto">Cash Flow Trend</div>
                      <div className="flex items-end h-32 gap-3 w-full">
                          <div className="flex-1 bg-emerald-500/20 rounded-t-sm h-1/4"></div>
                          <div className="flex-1 bg-emerald-500/40 rounded-t-sm h-2/4"></div>
                          <div className="flex-1 bg-emerald-500/60 rounded-t-sm h-1/3"></div>
                          <div className="flex-1 bg-emerald-500/80 rounded-t-sm h-3/4"></div>
                          <div className="flex-1 bg-emerald-500 rounded-t-sm h-full"></div>
                      </div>
                    </div>
                  </div>

               </div>
            </div>`;

if (page.includes('Hero Dashboard Glass Mockup')) {
  page = page.replace(targetMockup, newMockup);
  fs.writeFileSync('app/page.tsx', page, 'utf8');
} else {
  console.log("Could not find mockup block to replace");
}

