import { useState, useEffect } from 'react'
import { List, Lightbulb, ArrowRight, FileText, Activity, ArrowUpRight, ArrowDownLeft, Zap } from 'lucide-react'
import { walletService } from '../../services/walletService'

export function ActivityInsightsSection({ wallet }) {
  const [recentTxs, setRecentTxs] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true
    const fetchTxs = async () => {
      if (!wallet?.id) return
      setIsLoading(true)
      setError(null)
      try {
        const data = await walletService.getWalletTransactions(wallet.id, {
          type: 'normal',
          page: 1,
          limit: 5,
          analysisDays: 'all',
          customRange: null
        })
        if (mounted && data?.rows) {
          setRecentTxs(data.rows)
        }
      } catch (e) {
        if (mounted) setError(e.message || 'Unable to load recent activity')
        console.error(e)
      } finally {
        if (mounted) setIsLoading(false)
      }
    }
    fetchTxs()
    return () => { mounted = false }
  }, [wallet?.id])

  const personality = wallet?.personality
  const primaryTrait = personality?.traits?.[0]

  const formatTimeAgo = (timestamp) => {
    const diff = Date.now() - new Date(timestamp).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 60) return `${mins}m ago`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    if (days < 30) return `${days}d ago`
    const months = Math.floor(days / 30)
    return `${months}mo ago`
  }

  const formatValue = (val) => {
    if (!val || val === '0') return null
    const num = parseFloat(val)
    if (num < 0.0001) return '<0.0001 ETH'
    if (num < 1) return `${num.toFixed(4)} ETH`
    return `${num.toFixed(3)} ETH`
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 pb-10" style={{ fontFamily: "'Inter', 'DM Sans', system-ui, -apple-system, sans-serif" }}>
      
      {/* Recent Activity */}
      <div className="lg:col-span-3 rounded-[24px] p-6 flex flex-col shadow-sm hover:shadow-lg transition-all duration-300 relative overflow-hidden group glassmorphism" style={{ background: 'var(--card)', border: '1px solid rgba(255,255,255,0.05)', minHeight: 360 }}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-[radial-gradient(circle_at_top_right,var(--primary),transparent_70%)] opacity-[0.03] transition-opacity group-hover:opacity-[0.08] pointer-events-none" />
        <div className="flex items-center justify-between mb-5 relative z-10">
          <div className="flex items-center gap-2.5">
            <div style={{ width: 32, height: 32, borderRadius: 10, background: 'color-mix(in srgb, var(--primary) 10%, transparent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Activity size={16} strokeWidth={2.5} style={{ color: 'var(--primary)' }} />
            </div>
            <span className="text-[15px] font-bold" style={{ color: 'var(--ink)' }}>Recent Activity</span>
          </div>
          {recentTxs.length > 0 && (
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted)', background: 'var(--bg)', padding: '4px 10px', borderRadius: 8 }}>
              {recentTxs.length} transactions
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1 flex-1 overflow-y-auto">
          {isLoading ? (
            [1, 2, 3, 4].map(i => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 8px', borderRadius: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 12, background: 'var(--bg)', flexShrink: 0, animation: 'pulse 1.5s infinite' }} />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div style={{ height: 10, background: 'var(--bg)', borderRadius: 6, width: '60%', animation: 'pulse 1.5s infinite' }} />
                  <div style={{ height: 8, background: 'var(--bg)', borderRadius: 6, width: '40%', animation: 'pulse 1.5s infinite' }} />
                </div>
              </div>
            ))
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 py-8">
              <span style={{ fontSize: 13, fontWeight: 600, color: '#ef4444' }}>{error}</span>
            </div>
          ) : recentTxs.length > 0 ? (
            recentTxs.map((tx, idx) => {
              const isReceive = tx.direction === 'IN'
              const valueStr = formatValue(tx.value)
              const methodLabel = tx.method || (isReceive ? 'Received' : 'Sent')
              
              return (
                <a 
                  key={idx} 
                  href={`https://etherscan.io/tx/${tx.hash}`} 
                  target="_blank" 
                  rel="noreferrer"
                  style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 10px', borderRadius: 14, textDecoration: 'none', transition: 'background 0.15s', cursor: 'pointer' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{ 
                    width: 38, height: 38, borderRadius: 12, flexShrink: 0,
                    background: isReceive ? 'rgba(16,185,129,0.08)' : 'rgba(99,102,241,0.08)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: isReceive ? '#10b981' : '#6366f1'
                  }}>
                    {isReceive ? <ArrowDownLeft size={18} strokeWidth={2.5} /> : <ArrowUpRight size={18} strokeWidth={2.5} />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)', marginBottom: 2 }}>{methodLabel}</div>
                    <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--muted)' }}>{formatTimeAgo(tx.timestamp)}</div>
                  </div>
                  {valueStr && (
                    <span style={{ fontSize: 13, fontWeight: 700, color: isReceive ? '#10b981' : 'var(--ink)', flexShrink: 0 }}>
                      {isReceive ? '+' : '-'}{valueStr}
                    </span>
                  )}
                </a>
              )
            })
          ) : (
            <div className="flex flex-col items-center justify-center h-full py-8 gap-2">
              <div style={{ width: 48, height: 48, borderRadius: 16, background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
                <Activity size={20} strokeWidth={2} style={{ color: 'var(--muted)' }} />
              </div>
              <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)' }}>No recent activity</span>
              <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--muted)' }}>This wallet has no transactions in this period</span>
            </div>
          )}
        </div>
      </div>

      {/* Wallet Insights */}
      <div className="lg:col-span-2 rounded-[24px] p-6 flex flex-col shadow-sm hover:shadow-lg transition-all duration-300 relative overflow-hidden group glassmorphism" style={{ background: 'var(--card)', border: '1px solid rgba(255,255,255,0.05)', minHeight: 360 }}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-[radial-gradient(circle_at_top_right,var(--primary),transparent_70%)] opacity-[0.03] transition-opacity group-hover:opacity-[0.08] pointer-events-none" />
        <div className="flex items-center gap-2.5 mb-5 relative z-10">
          <div style={{ width: 32, height: 32, borderRadius: 10, background: 'color-mix(in srgb, var(--primary) 10%, transparent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={16} strokeWidth={2.5} style={{ color: 'var(--primary)' }} />
          </div>
          <span className="text-[15px] font-bold" style={{ color: 'var(--ink)' }}>Wallet Insights</span>
        </div>

        <div className="flex flex-col flex-1">
          {personality ? (
            <>
              <div className="flex items-center gap-3 mb-5">
                <div style={{ width: 44, height: 44, borderRadius: 14, background: 'color-mix(in srgb, var(--primary) 10%, transparent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FileText size={20} strokeWidth={2.5} style={{ color: 'var(--primary)' }} />
                </div>
                <div className="flex flex-col">
                  <span style={{ fontSize: 16, fontWeight: 800, color: 'var(--ink)' }}>{personality.title}</span>
                  {primaryTrait && (
                    <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--primary)' }}>{primaryTrait.value} Score</span>
                  )}
                </div>
              </div>
              <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--muted)', margin: 0, lineHeight: 1.7 }}>
                {personality.description}
              </p>
              {personality.explanation && (
                <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{personality.explanation.title}</span>
                  <p style={{ fontSize: 12, fontWeight: 500, color: 'var(--muted)', marginTop: 6, lineHeight: 1.6 }}>{personality.explanation.summary}</p>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full py-8">
              <div style={{ width: 48, height: 48, borderRadius: 16, background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                <Zap size={20} strokeWidth={2} style={{ color: 'var(--muted)' }} />
              </div>
              <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)', marginBottom: 4 }}>Wallet personality</span>
              <p style={{ fontSize: 12, fontWeight: 500, color: 'var(--muted)', textAlign: 'center', maxWidth: 220, margin: 0, lineHeight: 1.6 }}>
                AI-powered wallet analysis and behavior summary.
              </p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
      `}</style>
    </div>
  )
}
