import { Wallet, Diamond, Clock, ArrowRight, Activity } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'

export function MetricCards({ wallet }) {
  const navigate = useNavigate()
  const { address } = useParams()
  const portfolioValue = wallet?.balance?.value || '—'
  const isPartial = wallet?.valuation?.complete === false
  const periodLabel = wallet?.analysisDays === 'ytd' ? 'YTD' : 
                     wallet?.reportRange ? 'Custom' :
                     `${wallet?.analysisDays} Days`
  
  const ethBalanceRaw = wallet?.addressOverview?.ethBalance
  const ethBalance = ethBalanceRaw != null ? `${Number(ethBalanceRaw).toFixed(4)} ETH` : '—'
  
  const ethValueUsdRaw = wallet?.addressOverview?.ethValueUsd
  const ethValueUsd = ethValueUsdRaw != null ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(ethValueUsdRaw) : '—'

  let walletAge = '—'
  if (wallet?.addressOverview?.firstTransactionAt) {
    const firstDate = new Date(wallet.addressOverview.firstTransactionAt)
    const ageDays = Math.floor((Date.now() - firstDate.getTime()) / 86400000)
    if (ageDays < 30) walletAge = `${ageDays} days`
    else if (ageDays < 365) walletAge = `${Math.floor(ageDays/30)} months`
    else walletAge = `${(ageDays/365).toFixed(1)} years`
  }

  const txCount = wallet?.transactionCount?.toLocaleString() || '0'
  const portfolioChange = wallet?.valuation?.change || null
  const isPositive = portfolioChange?.startsWith('+')

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10" style={{ fontFamily: "'Inter', 'DM Sans', system-ui, -apple-system, sans-serif" }}>
      
      {/* Card 1: Portfolio Value */}
      <div className="bg-[var(--card)] border border-[rgba(255,255,255,0.05)] rounded-[24px] p-6 flex flex-col justify-between min-h-[150px] shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden glassmorphism">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(circle_at_top_right,var(--primary),transparent_70%)] opacity-5 transition-opacity group-hover:opacity-10 pointer-events-none" />
        <div className="flex items-center gap-2.5 text-[var(--ink)] mb-3 opacity-80 z-10">
          <Wallet size={18} strokeWidth={2.5} className="text-[var(--primary)]" />
          <span className="text-[14px] font-bold">Estimated Priced Value</span>
        </div>
        <div className="flex flex-wrap items-end gap-2 mb-3 z-10">
          <span className="text-[32px] font-extrabold tracking-tight text-[var(--ink)] leading-none drop-shadow-sm">{portfolioValue}</span>
          {portfolioChange && <span className={`text-[13px] font-bold px-2 py-0.5 rounded-md ${isPositive ? 'bg-[rgba(16,185,129,0.1)] text-[#10b981]' : 'bg-[rgba(239,68,68,0.1)] text-[#ef4444]'}`}>{portfolioChange}</span>}
        </div>
        <div className="flex items-center justify-between mt-auto z-10">
          <span className="text-[12px] font-semibold text-[var(--muted)] bg-[var(--surface)] px-2.5 py-1 rounded-md border border-[var(--border)]">
            {wallet?.balance?.coverageLabel || 'Pricing coverage unknown'}
          </span>
          {isPartial && <span className="text-[11px] font-black text-[#f59e0b] uppercase tracking-wider bg-[rgba(245,158,11,0.1)] px-2 py-1 rounded border border-[rgba(245,158,11,0.2)]">Partial</span>}
        </div>
      </div>

      {/* Card 2: ETH Balance */}
      <div className="bg-[var(--card)] border border-[rgba(255,255,255,0.05)] rounded-[24px] p-6 flex flex-col justify-between min-h-[150px] shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden glassmorphism">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(circle_at_top_right,var(--primary),transparent_70%)] opacity-5 transition-opacity group-hover:opacity-10 pointer-events-none" />
        <div className="flex items-center gap-2.5 text-[var(--ink)] mb-3 opacity-80 z-10">
          <Diamond size={18} strokeWidth={2.5} className="text-[var(--primary)]" />
          <span className="text-[14px] font-bold">ETH Balance</span>
        </div>
        <div className="flex items-end gap-3 mb-1.5 z-10">
          <span className="text-[32px] font-extrabold tracking-tight text-[var(--ink)] leading-none drop-shadow-sm">{ethBalance}</span>
        </div>
        <div className="mt-auto z-10">
          <span className="text-[13px] font-bold text-[var(--muted)] bg-[var(--surface)] px-2.5 py-1 rounded-md border border-[var(--border)]">{ethValueUsd}</span>
        </div>
      </div>

      {/* Card 3: First Activity */}
      <div className="bg-[var(--card)] border border-[rgba(255,255,255,0.05)] rounded-[24px] p-6 flex flex-col justify-between min-h-[150px] shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden glassmorphism">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(circle_at_top_right,var(--primary),transparent_70%)] opacity-5 transition-opacity group-hover:opacity-10 pointer-events-none" />
        <div className="flex items-center gap-2.5 text-[var(--ink)] mb-3 opacity-80 z-10">
          <Clock size={18} strokeWidth={2.5} className="text-[var(--primary)]" />
          <span className="text-[14px] font-bold">First Activity</span>
        </div>
        <div className="flex items-end gap-3 mb-3 z-10">
          <span className="text-[32px] font-extrabold tracking-tight text-[var(--ink)] leading-none drop-shadow-sm">{walletAge}</span>
        </div>
        <div className="mt-auto z-10">
          <span className="text-[12px] font-semibold text-[var(--muted)]">Time since first transaction</span>
        </div>
      </div>

      {/* Card 4: Transactions */}
      <div className="bg-[var(--card)] border border-[rgba(255,255,255,0.05)] rounded-[24px] p-6 flex flex-col justify-between min-h-[150px] shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden glassmorphism">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(circle_at_top_right,var(--primary),transparent_70%)] opacity-5 transition-opacity group-hover:opacity-10 pointer-events-none" />
        <div className="flex items-center justify-between gap-2.5 text-[var(--ink)] mb-3 opacity-80 z-10">
          <div className="flex items-center gap-2.5">
            <Activity size={18} strokeWidth={2.5} className="text-[var(--primary)]" />
            <span className="text-[14px] font-bold">Transactions</span>
          </div>
        </div>
        <div className="text-[32px] font-extrabold text-[var(--ink)] leading-none drop-shadow-sm z-10 mb-3">
          {txCount}
        </div>
        <div className="flex items-center justify-between mt-auto z-10">
          <span className="text-[12px] font-semibold text-[var(--muted)]">Period: <strong className="text-[var(--ink)]">{periodLabel}</strong></span>
          <button 
            onClick={() => navigate(`/wallet/${address}/transactions`)}
            className="flex items-center gap-1 text-[13px] font-bold text-[var(--primary)] hover:text-[var(--ink)] transition-colors p-0 bg-transparent border-none cursor-pointer w-fit group-hover:translate-x-1"
          >
            View all <ArrowRight size={14} strokeWidth={2.5} />
          </button>
        </div>
      </div>

    </div>
  )
}
