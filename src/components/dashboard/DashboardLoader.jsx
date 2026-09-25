import { Activity } from 'lucide-react'

export function DashboardLoader() {
  return (
    <div className="dashboard-loader fixed inset-0 z-[100] flex items-center justify-center bg-[var(--bg)]/70 backdrop-blur-md transition-all duration-500" role="status">
      <div className="flex flex-col items-center gap-6 p-8 rounded-3xl bg-[var(--surface)] shadow-[0_30px_100px_rgba(20,184,166,0.15)] border border-[var(--border)] dark:shadow-[0_30px_100px_rgba(20,184,166,0.08)] transform transition-transform duration-500 hover:scale-105">
        
        <div className="relative flex items-center justify-center w-20 h-20">
          <div className="absolute inset-0 border-4 border-teal-500/20 rounded-full animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
          <div className="absolute inset-0 border-[3px] border-transparent border-t-teal-500 rounded-full animate-spin" style={{ animationDuration: '1.2s' }}></div>
          <div className="absolute inset-2 bg-gradient-to-tr from-teal-500 to-emerald-400 rounded-full animate-pulse shadow-[0_0_20px_rgba(20,184,166,0.5)]"></div>
          <Activity className="absolute z-10 text-white w-7 h-7" />
        </div>
        
        <div className="flex flex-col items-center gap-1.5">
          <strong className="text-[17px] tracking-tight text-[var(--ink)] font-bold">Analyzing Wallet</strong>
          <p className="text-[13px] text-[var(--muted)] font-medium flex items-center m-0">
            Crunching on-chain data
            <div className="flex ml-1">
              <div className="animate-bounce" style={{ animationDelay: '0s' }}>.</div>
              <div className="animate-bounce" style={{ animationDelay: '0.15s' }}>.</div>
              <div className="animate-bounce" style={{ animationDelay: '0.3s' }}>.</div>
            </div>
          </p>
        </div>
      </div>
    </div>
  )
}
