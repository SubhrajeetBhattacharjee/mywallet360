import { useState, useMemo, useCallback } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Sector } from 'recharts'

const TOKEN_COLORS = [
  { start: '#14b8a6', end: '#0ea5e9', shadow: 'rgba(20,184,166,0.4)' },
  { start: '#8b5cf6', end: '#c084fc', shadow: 'rgba(139,92,246,0.4)' },
  { start: '#f59e0b', end: '#fcd34d', shadow: 'rgba(245,158,11,0.4)' },
  { start: '#ec4899', end: '#f472b6', shadow: 'rgba(236,72,153,0.4)' },
  { start: '#10b981', end: '#34d399', shadow: 'rgba(16,185,129,0.4)' },
  { start: '#3b82f6', end: '#60a5fa', shadow: 'rgba(59,130,246,0.4)' },
  { start: '#f97316', end: '#fb923c', shadow: 'rgba(249,115,22,0.4)' },
  { start: '#6366f1', end: '#818cf8', shadow: 'rgba(99,102,241,0.4)' },
]

const formatCompact = (v) => {
  if (!Number.isFinite(v)) return '$0.00'
  if (v >= 1_000_000_000) return `$${(v / 1_000_000_000).toFixed(2)}B`
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(2)}M`
  if (v >= 1_000) return `$${(v / 1_000).toFixed(1)}K`
  return `$${v.toFixed(2)}`
}

const safeNumber = (v) => Number.isFinite(Number(v)) ? Number(v) : 0

function TokenIcon({ symbol, size, colorIndex: forceColor, contractAddress }) {
  const [imgErrorLevel, setImgErrorLevel] = useState(0)
  const initial = (symbol || '?').charAt(0)
  const colorIndex = symbol ? symbol.charCodeAt(0) % TOKEN_COLORS.length : 0
  const finalIndex = forceColor !== undefined ? forceColor : colorIndex
  const color = TOKEN_COLORS[finalIndex % TOKEN_COLORS.length]
  const s = size === 'sm' ? 32 : 40
  const r = size === 'sm' ? 10 : 14
  
  const getLogoUrl = () => {
    if (!contractAddress || contractAddress === 'eth') {
      return 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png'
    }
    if (imgErrorLevel === 0) {
      // First try TrustWallet
      return `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${contractAddress}/logo.png`
    }
    // Then try DexScreener which covers almost all obscure/meme tokens
    return `https://dd.dexscreener.com/ds-data/tokens/ethereum/${contractAddress.toLowerCase()}.png`
  }

  if (imgErrorLevel < 2) {
    return (
      <div 
        className="flex items-center justify-center shrink-0 shadow-sm bg-[var(--surface)] overflow-hidden border border-[var(--border)]"
        style={{ width: s, height: s, borderRadius: r }}
      >
        <img 
          src={getLogoUrl()} 
          alt={symbol} 
          className="w-full h-full object-cover"
          onError={() => setImgErrorLevel(prev => prev + 1)}
        />
      </div>
    )
  }

  return (
    <div
      className="flex items-center justify-center shrink-0 text-white font-extrabold shadow-lg"
      style={{
        width: s,
        height: s,
        borderRadius: r,
        background: `linear-gradient(135deg, ${color.start}, ${color.end})`,
        boxShadow: `0 4px 12px ${color.shadow}, inset 0 2px 0 rgba(255,255,255,0.2)`,
        fontSize: size === 'sm' ? 12 : 16,
      }}
      aria-hidden="true"
    >
      {initial}
    </div>
  )
}

function renderActiveShape(props) {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props
  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius - 2}
        outerRadius={outerRadius + 10}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        style={{ 
          filter: `drop-shadow(0 8px 16px ${fill}60)`, 
          transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        }}
        cursor="pointer"
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 14}
        outerRadius={outerRadius + 16}
        fill={fill}
        style={{ transition: 'all 0.4s ease' }}
      />
    </g>
  )
}

function SkeletonRows() {
  return (
    <div className="flex flex-col gap-2 mt-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div className="grid grid-cols-[1.5fr_1fr_1fr_1.5fr] gap-4 items-center px-6 py-4 animate-pulse bg-[var(--bg)]/50 rounded-xl" key={i}>
          <div className="flex items-center gap-4">
            <div className="w-[32px] h-[32px] rounded-xl bg-[var(--border)] shrink-0" />
            <div className="flex flex-col gap-2 w-full">
              <div className="h-3 w-16 bg-[var(--border)] rounded-full" />
              <div className="h-2 w-24 bg-[var(--border)] rounded-full" />
            </div>
          </div>
          <div className="h-3 w-20 bg-[var(--border)] rounded-full" />
          <div className="h-3 w-16 bg-[var(--border)] rounded-full" />
          <div className="flex items-center gap-3">
            <div className="flex-1 h-2 rounded-full bg-[var(--border)]" />
            <div className="h-2 w-8 bg-[var(--border)] rounded-full" />
          </div>
        </div>
      ))}
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <div className="w-16 h-16 bg-[var(--bg)] text-[var(--muted)] rounded-full flex items-center justify-center mb-4 shadow-sm border border-[var(--border)]">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
          <path d="M12 18V6" />
        </svg>
      </div>
      <strong className="text-lg font-bold text-[var(--ink)] mb-1">No assets found</strong>
      <span className="text-sm text-[var(--muted)]">No priced assets were discovered for this wallet.</span>
    </div>
  )
}

export function PortfolioHoldings({ wallet }) {
  const holdings = wallet?.holdings || []
  const valuationHistory = wallet?.balance?.history || []
  const displayMode = 'usd'
  const ethPrice = wallet?.ethPrice || null
  const isLoading = false
  const [hoveredSymbol, setHoveredSymbol] = useState(null)
  const [hoveredLegend, setHoveredLegend] = useState(null)
  const [showAllTokens, setShowAllTokens] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortKey, setSortKey] = useState('usdValue')
  const [sortDir, setSortDir] = useState('desc')
  const [hideDust, setHideDust] = useState(false)
  const [hideUnpriced, setHideUnpriced] = useState(false)

  const activeSymbol = hoveredSymbol || hoveredLegend

  const performance = useMemo(() => {
    if (!valuationHistory || valuationHistory.length < 2) return null
    const first = safeNumber(valuationHistory[0]?.value)
    const last = safeNumber(valuationHistory[valuationHistory.length - 1]?.value)
    if (!first || !last || first === 0) return null
    return ((last - first) / Math.abs(first)) * 100
  }, [valuationHistory])

  const sorted = useMemo(() => {
    if (!holdings || holdings.length === 0) return []
    let filtered = [...holdings]

    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      filtered = filtered.filter((a) =>
        (a.symbol && a.symbol.toLowerCase().includes(q)) ||
        (a.name && a.name.toLowerCase().includes(q)) ||
        (a.contractAddress && a.contractAddress.toLowerCase().includes(q))
      )
    }

    if (hideDust) {
      filtered = filtered.filter((a) => (a.priceAvailable && safeNumber(a.rawUsdValue) >= 0.5) || !a.priceAvailable)
    }

    if (hideUnpriced) {
      filtered = filtered.filter((a) => a.priceAvailable)
    }

    const sorted = [...filtered].sort((a, b) => {
      let aVal, bVal
      switch (sortKey) {
        case 'symbol': aVal = (a.symbol || '').toLowerCase(); bVal = (b.symbol || '').toLowerCase(); break
        case 'balance': aVal = safeNumber(a.rawBalance); bVal = safeNumber(b.rawBalance); break
        case 'percentage': aVal = safeNumber(a.percentage); bVal = safeNumber(b.percentage); break
        case 'usdValue': default: aVal = safeNumber(a.rawUsdValue); bVal = safeNumber(b.rawUsdValue); break
      }
      return sortDir === 'desc' ? (bVal > aVal ? 1 : -1) : (aVal > bVal ? 1 : -1)
    })

    return sorted
  }, [holdings, searchQuery, sortKey, sortDir, hideDust, hideUnpriced])

  const pricedHoldings = useMemo(() => sorted.filter((a) => a.priceAvailable), [sorted])
  const unpricedHoldings = useMemo(() => sorted.filter((a) => !a.priceAvailable), [sorted])

  const totalRaw = useMemo(() => {
    return pricedHoldings.reduce((sum, a) => sum + safeNumber(a.rawUsdValue), 0)
  }, [pricedHoldings])

  const formatValue = useCallback((v) => {
    if (displayMode === 'tokens' && ethPrice) {
      const ethVal = v / ethPrice
      if (ethVal >= 1000) return `${(ethVal / 1000).toFixed(2)}K ETH`
      return `${ethVal.toFixed(4)} ETH`
    }
    return formatCompact(v)
  }, [displayMode, ethPrice])

  const donutData = useMemo(() => {
    return pricedHoldings.slice(0, 8).map((h, i) => {
      const color = TOKEN_COLORS[i % TOKEN_COLORS.length]
      return {
        name: h.symbol,
        rawValue: safeNumber(h.rawUsdValue),
        fill: `url(#gradient-${h.symbol})`,
        colorConfig: color,
        percent: h.percentage,
      }
    })
  }, [pricedHoldings])

  const toggleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => d === 'desc' ? 'asc' : 'desc')
    } else {
      setSortKey(key)
      setSortDir('desc')
    }
  }

  const exportCSV = useCallback(() => {
    const headers = ['Token', 'Name', 'Balance', 'USD Value', 'Allocation %', 'Contract Address', 'Price Available']
    const rows = sorted.map((a) => [
      a.symbol || '',
      a.name || '',
      a.rawBalance ?? a.balance ?? '',
      a.rawUsdValue ?? a.usdValue ?? '',
      a.percentage ?? 0,
      a.contractAddress || '',
      a.priceAvailable ? 'Yes' : 'No',
    ])
    
    const escapeCSV = (field) => {
      const stringField = String(field)
      if (stringField.includes(',') || stringField.includes('"') || stringField.includes('\n')) {
        return `"${stringField.replace(/"/g, '""')}"`
      }
      return stringField
    }

    const csv = [headers, ...rows]
      .map((row) => row.map(escapeCSV).join(','))
      .join('\n')
      
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `portfolio-${wallet?.id?.slice(0, 8) || 'export'}-holdings.csv`
    a.click()
    URL.revokeObjectURL(url)
  }, [sorted, wallet?.id])

  const SortHeader = ({ label, field }) => (
    <button
      className={`flex items-center gap-1.5 transition-colors cursor-pointer border-none bg-transparent ${sortKey === field ? 'text-teal-500' : 'text-[var(--muted)] hover:text-[var(--ink)]'}`}
      onClick={() => toggleSort(field)}
    >
      {label}
      {sortKey === field && (
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
          style={{ transform: sortDir === 'asc' ? 'rotate(180deg)' : 'none', transition: 'transform .3s cubic-bezier(0.4, 0, 0.2, 1)' }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      )}
    </button>
  )

  if (isLoading) {
    return (
      <section className="bg-[var(--surface)]/60 backdrop-blur-2xl border border-[var(--border)] shadow-[0_8px_32px_rgba(15,23,42,0.04)] rounded-[32px] p-8 max-[480px]:p-5">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[20px] font-extrabold text-[var(--ink)] tracking-tight">Portfolio Assets</h2>
        </div>
        <div className="h-12 w-48 bg-[var(--surface)] rounded-xl mb-10 animate-pulse" />
        <SkeletonRows />
      </section>
    )
  }

  if (sorted.length === 0 && !searchQuery) {
    return (
      <section className="bg-[var(--surface)]/60 backdrop-blur-2xl border border-[var(--border)] shadow-[0_8px_32px_rgba(15,23,42,0.04)] rounded-[32px] p-8 max-[480px]:p-5">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[20px] font-extrabold text-[var(--ink)] tracking-tight">Portfolio Assets</h2>
        </div>
        <EmptyState />
      </section>
    )
  }

  return (
    <section className="bg-[var(--surface)]/60 backdrop-blur-2xl border border-[var(--border)] shadow-[0_8px_32px_rgba(15,23,42,0.04)] rounded-[32px] p-8 max-[480px]:p-5 overflow-hidden relative">
      {/* Decorative gradient orb */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-teal-400/10 rounded-full blur-[80px] -z-10 pointer-events-none" />
      
      <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
        <div className="flex items-center gap-3">
          <h2 className="text-[20px] font-extrabold text-[var(--ink)] tracking-tight">Portfolio Assets</h2>
          <div className="flex items-center gap-2">
            <span className="text-[12px] font-bold text-[var(--muted)] bg-[var(--surface)]/80 backdrop-blur-sm px-3 py-1 rounded-xl shadow-sm border border-[var(--border)]/50">
              {sorted.length} total
            </span>
            {wallet?.pricedAssetCount != null && wallet?.assetCount != null && (
              <span className="text-[12px] font-bold text-teal-600 dark:text-teal-400 bg-teal-500/10 dark:bg-teal-400/10 backdrop-blur-sm px-3 py-1 rounded-xl shadow-sm border border-teal-500/20 dark:border-teal-400/20">
                {wallet.pricedAssetCount} of {wallet.assetCount} priced
              </span>
            )}
            {performance !== null && (
              <span className={`text-[12px] font-extrabold px-3 py-1 rounded-xl shadow-sm border ${performance >= 0 ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 dark:bg-emerald-400/10 border-emerald-500/20 dark:border-emerald-400/20' : 'text-rose-600 dark:text-rose-400 bg-rose-500/10 dark:bg-rose-400/10 border-rose-500/20 dark:border-rose-400/20'}`}>
                {performance >= 0 ? '↗' : '↘'} {Math.abs(performance).toFixed(1)}%
              </span>
            )}
          </div>
        </div>
        <button
          className="text-[13px] font-bold flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--surface)] shadow-sm border border-[var(--border)] hover:shadow-md hover:border-slate-300 hover:-translate-y-0.5 transition-all duration-300 text-[var(--ink)] hover:text-[var(--ink)]"
          onClick={exportCSV}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Export CSV
        </button>
      </div>

      <div className="flex items-end gap-3 mb-10">
        <strong className="text-[48px] font-black text-transparent bg-clip-text bg-gradient-to-br from-slate-800 to-slate-500 leading-none tracking-tighter drop-shadow-sm">
          {formatValue(totalRaw)}
        </strong>
        {unpricedHoldings.length > 0 && (
          <span className="text-[13px] font-bold text-[var(--muted)] mb-1.5">
            {pricedHoldings.length} priced · {unpricedHoldings.length} unpriced
          </span>
        )}
      </div>

      {donutData.length > 0 && (
        <div className="flex flex-col items-center mb-12">
          <div className="relative w-full max-w-[320px] aspect-square">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <defs>
                  {donutData.map((entry, index) => (
                    <linearGradient key={`gradient-${entry.name}`} id={`gradient-${entry.name}`} x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor={entry.colorConfig.start} />
                      <stop offset="100%" stopColor={entry.colorConfig.end} />
                    </linearGradient>
                  ))}
                </defs>
                <Pie
                  data={donutData}
                  dataKey="rawValue"
                  nameKey="name"
                  cx="50%" cy="50%"
                  innerRadius="65%"
                  outerRadius="90%"
                  paddingAngle={2}
                  activeIndex={activeSymbol ? donutData.findIndex((d) => d.name === activeSymbol) : undefined}
                  activeShape={renderActiveShape}
                  strokeWidth={0}
                  onMouseEnter={(_, index) => setHoveredSymbol(donutData[index]?.name)}
                  onMouseLeave={() => setHoveredSymbol(null)}
                  animationBegin={0}
                  animationDuration={800}
                  animationEasing="ease-out"
                >
                  {donutData.map((entry, i) => (
                    <Cell
                      key={`cell-${i}`}
                      fill={entry.fill}
                      style={{
                        filter: activeSymbol && activeSymbol !== entry.name ? 'saturate(0.2) opacity(0.4)' : 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
                        transition: 'all .3s cubic-bezier(0.4, 0, 0.2, 1)',
                        cursor: 'pointer',
                      }}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <strong className="text-[28px] font-black text-[var(--ink)] tracking-tight">{formatValue(totalRaw)}</strong>
              <span className="text-[11px] font-bold text-[var(--muted)] uppercase tracking-widest mt-1">Total Value</span>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-3 mt-6 px-4">
            {donutData.map((entry) => (
              <div
                key={entry.name}
                className={`flex items-center gap-2 px-4 py-2 rounded-2xl cursor-pointer transition-all duration-300 border ${
                  activeSymbol === entry.name 
                    ? 'bg-[var(--surface)] shadow-lg border-[var(--border)] scale-105' 
                    : 'bg-transparent border-transparent hover:bg-[var(--surface)]/50'
                }`}
                onMouseEnter={() => setHoveredLegend(entry.name)}
                onMouseLeave={() => setHoveredLegend(null)}
              >
                <div 
                  className="w-3 h-3 rounded-full shadow-inner" 
                  style={{ background: `linear-gradient(135deg, ${entry.colorConfig.start}, ${entry.colorConfig.end})` }} 
                />
                <span className="text-[13px] font-bold text-[var(--ink)]">{entry.name}</span>
                <span className="text-[12px] font-semibold text-[var(--muted)]">{entry.percent}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-4 mb-6 bg-[var(--surface)]/40 backdrop-blur-md p-3 rounded-2xl border border-[var(--border)]">
        <div className="relative flex-1 min-w-[240px]">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)]"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search tokens or contracts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 pl-11 pr-4 rounded-xl border-none bg-[var(--surface)] shadow-sm text-[13px] font-semibold text-[var(--ink)] placeholder:text-[var(--muted)] outline-none focus:ring-2 focus:ring-teal-400/30 transition-shadow"
          />
        </div>
        <div className="flex items-center gap-4 px-2">
          <label className="flex items-center gap-2 text-[12px] font-bold text-[var(--ink)] cursor-pointer select-none hover:text-[var(--ink)] transition-colors">
            <input type="checkbox" checked={hideDust} onChange={() => setHideDust(!hideDust)} className="w-4 h-4 rounded text-teal-500 focus:ring-teal-500 border-slate-300 accent-teal-500 cursor-pointer" />
            Hide dust
          </label>
          <label className="flex items-center gap-2 text-[12px] font-bold text-[var(--ink)] cursor-pointer select-none hover:text-[var(--ink)] transition-colors">
            <input type="checkbox" checked={hideUnpriced} onChange={() => setHideUnpriced(!hideUnpriced)} className="w-4 h-4 rounded text-teal-500 focus:ring-teal-500 border-slate-300 accent-teal-500 cursor-pointer" />
            Priced only
          </label>
        </div>
      </div>

      <div className="bg-[var(--surface)] rounded-2xl shadow-sm border border-[var(--border)] overflow-hidden">
        <div className="grid grid-cols-[1.5fr_1fr_1fr_1.5fr] gap-4 px-6 py-4 text-[11px] font-extrabold text-[var(--muted)] uppercase tracking-widest border-b border-[var(--border)] bg-[var(--bg)]/50">
          <span className="flex items-center gap-1">
            <SortHeader label="Token" field="symbol" />
          </span>
          <SortHeader label="Balance" field="balance" />
          <SortHeader label="Value" field="usdValue" />
          <SortHeader label="Allocation" field="percentage" />
        </div>

        <div className="max-h-[500px] overflow-y-auto">
          {pricedHoldings.map((asset, i) => {
            const isHighlighted = activeSymbol === asset.symbol
            const color = TOKEN_COLORS[i % TOKEN_COLORS.length]
            return (
              <div
                className={`grid grid-cols-[1.5fr_1fr_1fr_1.5fr] gap-4 items-center px-6 py-4 border-b border-[var(--border)] last:border-0 transition-all duration-300 ${
                  isHighlighted 
                    ? 'bg-teal-500/10 dark:bg-teal-400/10 scale-[1.01] shadow-sm z-10 relative rounded-xl mx-2 my-1 border-transparent' 
                    : 'hover:bg-[var(--bg)] cursor-pointer'
                }`}
                key={`${asset.contractAddress || 'eth'}-${asset.symbol}`}
                onMouseEnter={() => setHoveredSymbol(asset.symbol)}
                onMouseLeave={() => setHoveredSymbol(null)}
              >
                <div className="flex items-center gap-4 min-w-0">
                  <TokenIcon symbol={asset.symbol} contractAddress={asset.contractAddress} size="sm" colorIndex={i} />
                  <div className="min-w-0">
                    <strong className="text-[14px] font-extrabold text-[var(--ink)] block truncate leading-tight">{asset.symbol}</strong>
                    <span className="text-[12px] font-semibold text-[var(--muted)] block truncate">{asset.name}</span>
                  </div>
                </div>
                <span className="text-[13px] font-bold text-[var(--ink)] truncate">{asset.balance}</span>
                <strong className="text-[14px] font-extrabold text-[var(--ink)]">
                  {displayMode === 'tokens' && ethPrice ? `${(safeNumber(asset.rawUsdValue) / ethPrice).toFixed(4)} ETH` : asset.usdValue || '—'}
                </strong>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 rounded-full bg-[var(--surface)] overflow-hidden shadow-inner">
                    <div 
                      className="h-full rounded-full relative overflow-hidden" 
                      style={{ 
                        width: `${Math.min(asset.percentage || 0, 100)}%`,
                        background: `linear-gradient(90deg, ${color.start}, ${color.end})`
                      }} 
                    >
                      {/* Shine effect inside the bar */}
                      <div className="absolute top-0 left-0 w-full h-1 bg-[var(--surface)]/30" />
                    </div>
                  </div>
                  <span className="text-[12px] font-bold text-[var(--muted)] w-12 text-right tracking-tight">{asset.percentage || 0}%</span>
                </div>
              </div>
            )
          })}
        </div>

        {unpricedHoldings.length > 0 && (
          <div className="bg-[var(--bg)] border-t border-[var(--border)] pb-2">
            <button
              className="flex items-center justify-center gap-2 w-full py-4 text-[12px] font-bold text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--surface)]/50 transition-colors cursor-pointer border-none bg-transparent"
              onClick={() => setShowAllTokens(!showAllTokens)}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                style={{ transform: showAllTokens ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform .3s cubic-bezier(0.4, 0, 0.2, 1)' }}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
              {showAllTokens ? 'Hide' : 'Show'} {unpricedHoldings.length} unpriced token{unpricedHoldings.length > 1 ? 's' : ''}
            </button>
            {showAllTokens && (
              <div className="border-t border-[var(--border)]/50">
                {unpricedHoldings.map((asset, i) => (
                  <div
                    className="grid grid-cols-[1.5fr_1fr_1fr_1.5fr] gap-4 items-center px-6 py-3 opacity-60 hover:opacity-100 transition-opacity bg-[var(--surface)]"
                    key={`${asset.contractAddress || 'unk'}-${asset.symbol}`}
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <TokenIcon symbol={asset.symbol} contractAddress={asset.contractAddress} size="sm" colorIndex={i + pricedHoldings.length} />
                      <div className="min-w-0">
                        <strong className="text-[13px] font-bold text-[var(--ink)] block truncate">{asset.symbol || 'Unknown'}</strong>
                        <span className="text-[11px] font-medium text-[var(--muted)] block truncate">{asset.name || '—'}</span>
                      </div>
                    </div>
                    <span className="text-[12px] font-bold text-[var(--muted)] truncate">{asset.displayBalance || asset.balance}</span>
                    <strong className="text-[13px] font-bold text-[var(--muted)]">—</strong>
                    <span className="text-[12px] font-bold text-[var(--muted)]">—</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
