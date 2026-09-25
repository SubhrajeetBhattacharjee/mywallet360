import { useState, useMemo } from 'react'
import { TrendingUp, PieChart as PieChartIcon, BarChart3 } from 'lucide-react'
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, PieChart, Pie, Cell } from 'recharts'

const formatUsd = (v) => new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
  notation: Math.abs(v) >= 1_000_000 ? 'compact' : 'standard',
}).format(v)

const formatChartDate = (dateStr) => {
  const d = new Date(`${dateStr}T00:00:00Z`)
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' }).format(d)
}

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.[0]) return null
  const point = payload[0].payload
  return (
    <div className="bg-[var(--card)] border border-[var(--border)] shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-xl p-3 flex flex-col gap-1.5 min-w-[120px]">
      <span className="text-[11px] font-bold text-[var(--muted)] uppercase tracking-wider">{formatChartDate(point.date, { year: 'numeric' })}</span>
      <strong className="text-[16px] font-extrabold text-[var(--ink)] tracking-tight">{formatUsd(point.value)}</strong>
    </div>
  )
}

const DAY_MS = 86_400_000
const CHART_PERIODS = [
  { value: '7d', label: '7D' },
  { value: '30d', label: '30D' },
  { value: 'ytd', label: 'YTD' },
  { value: 'all', label: 'ALL' },
]

const PIE_COLORS = ['#18c5c0', '#3b82f6', '#8b5cf6', '#f43f5e', '#f59e0b', '#64748b']

export function ChartsSection({ wallet }) {
  const history = wallet?.balance?.history || []
  const hasHistory = history.length > 0
  
  const allocation = useMemo(() => {
    if (!wallet?.holdings) return []
    const pricedHoldings = wallet.holdings.filter(a => a.priceAvailable)
    const sorted = [...pricedHoldings].sort((a, b) => (b.rawUsdValue || 0) - (a.rawUsdValue || 0))
    const top = sorted.slice(0, 4)
    const others = sorted.slice(4)
    const data = top.map(a => ({ name: a.symbol, value: a.rawUsdValue || 0 }))
    if (others.length > 0) {
      const othersTotal = others.reduce((sum, a) => sum + (a.rawUsdValue || 0), 0)
      if (othersTotal > 0) data.push({ name: 'Other', value: othersTotal })
    }
    return data
  }, [wallet?.holdings])
  
  const [chartPeriod, setChartPeriod] = useState('all')

  const filteredHistory = useMemo(() => {
    if (!hasHistory) return []
    if (chartPeriod === 'all') return history

    const sorted = [...history]
      .map((p) => ({ ...p, dateObj: new Date(`${p.date}T00:00:00Z`) }))
      .sort((a, b) => a.dateObj - b.dateObj)

    const now = new Date()
    let cutoff
    switch (chartPeriod) {
      case '7d': cutoff = new Date(now.getTime() - 7 * DAY_MS); break
      case '30d': cutoff = new Date(now.getTime() - 30 * DAY_MS); break
      case 'ytd': cutoff = new Date(now.getFullYear(), 0, 1); break
      default: cutoff = new Date(0); break
    }
    return sorted.filter((p) => p.dateObj >= cutoff)
  }, [history, hasHistory, chartPeriod])
  const hasAllocation = allocation.length > 0

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-8" style={{ fontFamily: "'Inter', 'DM Sans', system-ui, -apple-system, sans-serif" }}>
      
      {/* Portfolio Value Chart */}
      <div className="lg:col-span-2 bg-[var(--card)] border border-[rgba(255,255,255,0.05)] rounded-[24px] p-6 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-[360px] relative overflow-hidden group glassmorphism">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[radial-gradient(circle_at_top_right,var(--primary),transparent_70%)] opacity-[0.03] transition-opacity group-hover:opacity-[0.08] pointer-events-none" />
        
        <div className="flex items-center justify-between mb-4 relative z-10">
          <div className="flex items-center gap-2.5 text-[var(--ink)]">
            <TrendingUp size={18} strokeWidth={2.5} className="text-[var(--primary)]" />
            <span className="text-[15px] font-bold tracking-tight">Portfolio Value</span>
          </div>
          <div className="flex items-center gap-1 bg-[var(--surface)] rounded-[10px] p-1 border border-[var(--border)]">
            {CHART_PERIODS.map(p => (
              <button
                key={p.value}
                onClick={() => setChartPeriod(p.value)}
                className={`px-3 py-1.5 rounded-md text-[12px] font-bold cursor-pointer transition-all border-none ${chartPeriod === p.value ? 'bg-[var(--card)] text-[var(--primary)] shadow-sm' : 'bg-transparent text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[color-mix(in_srgb,var(--ink)_5%,transparent)]'}`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {hasHistory ? (
          <div className="flex-1 min-h-0 relative z-10 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={filteredHistory} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#18c5c0" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#18c5c0" stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(d) => formatChartDate(d)} 
                  tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 500 }} 
                  axisLine={false} 
                  tickLine={false} 
                  minTickGap={30}
                  dy={10}
                />
                <YAxis 
                  tickFormatter={(v) => (Math.abs(v) >= 1000 ? `$${(v / 1000).toFixed(0)}k` : `$${Math.round(v)}`)} 
                  tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 500 }} 
                  axisLine={false} 
                  tickLine={false}
                  width={45}
                  dx={-10}
                />
                <Tooltip 
                  content={<CustomTooltip />} 
                  cursor={{ stroke: '#94a3b8', strokeDasharray: '4 4', opacity: 0.5 }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#18c5c0" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#colorValue)"
                  animationDuration={750}
                  animationEasing="ease-out"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pt-10">
            <div className="w-10 h-10 rounded-full bg-[var(--bg)] flex items-center justify-center mb-3 text-[var(--muted)]">
              <BarChart3 size={18} strokeWidth={2} />
            </div>
            <span className="text-[13px] font-medium text-[var(--muted)]">
              {wallet ? 'No historical data' : 'Search a wallet to view portfolio chart'}
            </span>
          </div>
        )}
      </div>

      {/* Token Allocation Donut */}
      <div className="lg:col-span-1 bg-[var(--card)] border border-[rgba(255,255,255,0.05)] rounded-[24px] p-6 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-[360px] relative overflow-hidden group glassmorphism">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[radial-gradient(circle_at_top_right,var(--primary),transparent_70%)] opacity-[0.03] transition-opacity group-hover:opacity-[0.08] pointer-events-none" />
        <div className="flex items-center gap-2.5 text-[var(--ink)] mb-auto z-10">
          <PieChartIcon size={18} strokeWidth={2.5} className="text-[var(--primary)]" />
          <span className="text-[15px] font-bold tracking-tight">Token Allocation</span>
        </div>

        {hasAllocation ? (
          <div className="flex flex-col items-center justify-center flex-1">
            <div className="flex items-center gap-6 w-full mt-4">
              <div className="w-[130px] h-[130px] flex-shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={allocation} innerRadius={42} outerRadius={60} paddingAngle={2} dataKey="value" stroke="none">
                      {allocation.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => formatUsd(value)}
                      contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px', fontWeight: 600, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-col gap-2.5 flex-1 min-w-0 z-10">
                {allocation.map((entry, index) => (
                  <div key={entry.name} className="flex items-center justify-between gap-2 text-[13px] font-bold text-[var(--ink)] opacity-90 hover:opacity-100 transition-opacity">
                    <div className="flex items-center gap-2 truncate">
                      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }} />
                      <span className="truncate">{entry.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center flex-1 z-10">
            <div className="flex items-center gap-8 mb-6">
              <div className="w-[120px] h-[120px] rounded-full border-[24px] border-[var(--surface)] transition-transform group-hover:scale-105 duration-500"></div>
              <div className="flex flex-col gap-3">
                <div className="w-12 h-2.5 rounded-full bg-[var(--surface)]"></div>
                <div className="w-16 h-2.5 rounded-full bg-[var(--surface)]"></div>
                <div className="w-10 h-2.5 rounded-full bg-[var(--surface)]"></div>
              </div>
            </div>
            <span className="text-[13px] font-semibold text-[var(--muted)] text-center max-w-[160px] leading-relaxed">
              {wallet ? 'No priced tokens found' : 'Search a wallet to view token allocation'}
            </span>
          </div>
        )}
      </div>

    </div>
  )
}
