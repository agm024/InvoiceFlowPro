const fs = require('fs');

let dashboard = fs.readFileSync('app/app/page.tsx', 'utf8');

const targetChart = `<div className="h-72">
            <RevenueChart data={revenueChartData} />
          </div>`;

const newChart = `<div className="h-72 relative">
            {revenueChartData.every(d => d.revenue === 0 && d.expenses === 0) ? (
               <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-10 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-[2px]">
                 <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center mb-3">
                   <span className="text-xl">📈</span>
                 </div>
                 <p className="font-semibold text-zinc-700 dark:text-zinc-300">Your cash-flow chart will appear here</p>
                 <p className="text-xs text-zinc-500 mt-1 max-w-xs">Create invoices and record payments to start seeing your financial trends.</p>
               </div>
            ) : null}
            <RevenueChart data={revenueChartData} />
          </div>`;

dashboard = dashboard.replace(targetChart, newChart);

// Also empty state for top clients
const targetClients = `<tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 font-medium">
                {topClients.map(client => (`;

const newClients = `<tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 font-medium">
                {topClients.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-6 py-12 text-center">
                       <p className="font-semibold text-zinc-700 dark:text-zinc-300">No client data yet</p>
                       <p className="text-xs text-zinc-500 mt-1">Add clients and generate revenue to see your top performers.</p>
                    </td>
                  </tr>
                )}
                {topClients.map(client => (`;

dashboard = dashboard.replace(targetClients, newClients);

fs.writeFileSync('app/app/page.tsx', dashboard, 'utf8');

