import { useMemo } from 'react'
import { MaterialIcon } from '../common/MaterialIcon'

const safeNumber = (v) => Number.isFinite(Number(v)) ? Number(v) : 0

export function Insights({ insights, wallet, periodLabel }) {
  const computedInsights = useMemo(() => {
    const result = []
    const assets = wallet?.assets || []
    const pricedAssets = assets.filter((a) => a.priceAvailable)
    const unpricedAssets = assets.filter((a) => !a.priceAvailable)
    const totalPriced = pricedAssets.reduce((sum, a) => sum + safeNumber(a.usdValue), 0)
    const nftCount = safeNumber(wallet?.nftCount ?? 0)
    const transactionCount = safeNumber(wallet?.transactionCount ?? 0)
    const pricingCoveragePercent = safeNumber(wallet?.pricingCoveragePercent)
    const pricedOnlyNote = pricingCoveragePercent > 0 && pricingCoveragePercent < 100
      ? ` Based on priced assets only (${pricingCoveragePercent}%).`
      : ''

    // Largest concentration
    if (pricedAssets.length > 0) {
      const sorted = [...pricedAssets].sort((a, b) => safeNumber(b.usdValue) - safeNumber(a.usdValue))
      const largest = sorted[0]
      const largestPct = largest.percentage != null
        ? safeNumber(largest.percentage)
        : (totalPriced > 0 ? (safeNumber(largest.usdValue) / totalPriced) * 100 : 0)
      const top3Pct = totalPriced > 0
        ? sorted.slice(0, 3).reduce((sum, a) => sum + safeNumber(a.usdValue), 0) / totalPriced * 100
        : 0

      if (largestPct > 50) {
        result.push({
          icon: 'layers',
          title: 'Concentration Risk',
          text: `Top 3 priced assets make up ${largestPct.toFixed(0)}% of your priced portfolio. Low diversification.${pricedOnlyNote}`,
          tone: 'attention',
          metric: `${largestPct.toFixed(0)}%`,
          progress: largestPct,
          progressLabel: 'Concentration (Top 3 assets)',
        })
      }

      if (top3Pct > 80) {
        result.push({
          icon: 'layers',
          title: 'Concentration Risk',
          text: `Top 3 priced assets make up ${top3Pct.toFixed(0)}% of priced value. Low diversification.${pricedOnlyNote}`,
          tone: 'info',
          metric: `${top3Pct.toFixed(0)}%`,
          progress: top3Pct,
          progressLabel: 'Concentration (Top 3 assets)',
        })
      }
    }
    
    // Stablecoin exposure
    const stablecoins = pricedAssets.filter((a) => 
      ['USDC', 'USDT', 'DAI', 'BUSD', 'FRAX', 'TUSD'].includes(a.symbol)
    )
    const stablecoinPct = totalPriced > 0
      ? stablecoins.reduce((sum, a) => sum + safeNumber(a.usdValue), 0) / totalPriced * 100
      : 0
    
    if (stablecoinPct === 0 && pricedAssets.length > 0) {
      result.push({
        icon: 'account_balance',
        title: 'Stablecoin Exposure',
        text: 'No stablecoin exposure detected. Consider adding stablecoins for downside protection.',
        tone: 'info',
        metric: '0%',
        progress: 0,
        progressLabel: 'Stablecoin allocation',
      })
    } else if (stablecoinPct > 0 && stablecoinPct < 5) {
      result.push({
        icon: 'account_balance',
        title: 'Stablecoin Exposure',
        text: `Only ${stablecoinPct.toFixed(0)}% stablecoin exposure. Limited downside protection.`,
        tone: 'info',
        metric: `${stablecoinPct.toFixed(0)}%`,
        progress: stablecoinPct,
        progressLabel: 'Stablecoin allocation',
      })
    }
    
    // Unpriced assets
    if (unpricedAssets.length > 0) {
      result.push({
        icon: 'help',
        title: 'Missing Market Data',
        text: `${unpricedAssets.length} asset${unpricedAssets.length !== 1 ? 's have' : ' has'} no market data available.`,
        tone: 'info',
        metric: `${unpricedAssets.length}`,
        progress: Math.min((unpricedAssets.length / Math.max(assets.length, 1)) * 100, 100),
        progressLabel: 'Assets without market data',
      })
    }
    
    // Inactivity — use last on-chain activity, not API fetch time
    if (wallet?.lastActivityAt) {
      const elapsedDays = Math.floor((Date.now() - new Date(wallet.lastActivityAt).getTime()) / 86400000)
      if (elapsedDays > 30) {
        result.push({
          icon: 'schedule',
          text: `Last on-chain activity was ${elapsedDays} days ago (${transactionCount} txns in the selected period).`,
          tone: 'attention',
          metric: `${elapsedDays}d`,
        })
      }
    } else if (transactionCount === 0) {
      result.push({
        icon: 'schedule',
        title: 'No Activity',
        text: 'No transactions found in the selected analysis period.',
        tone: 'info',
        metric: '0',
        progress: 0,
        progressLabel: 'Transactions in period',
      })
    }
    
    // NFT focus
    if (nftCount > 10) {
      result.push({
        icon: 'collections_bookmark',
        title: 'NFT Collection',
        text: `${nftCount} NFTs detected in your portfolio. Strong NFT collector profile.`,
        tone: 'info',
        metric: `${nftCount}`,
        progress: Math.min((nftCount / 100) * 100, 100),
        progressLabel: 'NFTs in portfolio',
      })
    }
    
    // Pricing coverage
    if (assets.length > 0) {
      result.push({
        icon: 'price_check',
        title: 'Priced Tokens Coverage',
        text: `${pricedAssets.length} of ${assets.length} held tokens priced (${pricingCoveragePercent || Math.round((pricedAssets.length / assets.length) * 100)}%).`,
        tone: pricedAssets.length === assets.length ? 'good' : 'info',
        metric: `${pricedAssets.length}/${assets.length}`,
        progress: pricingCoveragePercent || Math.round((pricedAssets.length / assets.length) * 100),
        progressLabel: 'Tokens with price data',
      })
    }
    
    return result.slice(0, 5)
  }, [wallet])

  const hasPeriodScopedInsight = computedInsights.some((insight) =>
    insight.text.includes('selected period') || insight.text.includes('txns in'),
  )
  
  if (computedInsights.length === 0 && (!insights || insights.length === 0)) {
    return null
  }
  
  return (
    <section>
      <div className="mb-8">
        <span className="text-[12px] font-bold text-[var(--muted)]/80 uppercase tracking-[0.15em] block mb-2.5">Heuristic Analysis</span>
        <h2 className="text-[28px] font-black text-[var(--ink)] tracking-tight leading-none mb-3.5">Portfolio Insights</h2>
        <p className="text-[15px] font-medium text-[var(--muted)]/90">
          Key observations about your portfolio based on on-chain and pricing data.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {computedInsights.map((insight, i) => {
          // If there's an odd number of items, make the last one span both columns on large screens
          const isOddLastItem = computedInsights.length % 2 !== 0 && i === computedInsights.length - 1;
          return (
            <div
              key={i}
              className={`flex flex-col bg-[var(--surface)] border border-[var(--border)] shadow-sm rounded-2xl p-6 ${isOddLastItem ? 'lg:col-span-2' : ''}`}
            >
              {/* Top row: Icon, Title, Text, Metric */}
              <div className="flex items-start gap-4 mb-6">
                <span className="shrink-0 w-12 h-12 rounded-[14px] flex items-center justify-center bg-[var(--bg)]/80 border border-[var(--border)] text-[var(--ink)]">
                  <MaterialIcon icon={insight.icon} className="text-[24px]" />
                </span>
                <div className="flex-1 min-w-0 pt-0.5">
                  <h3 className="text-[16px] font-bold text-[var(--ink)]">{insight.title || insight.label || 'Insight'}</h3>
                  <p className="text-[14px] font-medium text-[var(--muted)] mt-2 leading-relaxed pr-2">{insight.text || `${insight.label}: ${insight.value} ${insight.suffix}`}</p>
                </div>
                <span className="text-[24px] font-black text-[var(--ink)] shrink-0">
                  {insight.metric || insight.value}
                </span>
              </div>
              
              {/* Bottom row: Progress bar */}
              {(insight.progress !== undefined || insight.progressLabel) && (
                <div className="mt-auto">
                  <div className="w-full h-3 bg-[var(--surface)]/80 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#7a8b9e] rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(2, insight.progress || 0)}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-[13px] font-semibold text-[var(--muted)]">{insight.progressLabel || 'Metric'}</span>
                    <span className="text-[13px] font-bold text-[var(--ink)]">{insight.metric}</span>
                  </div>
                </div>
              )}
            </div>
          )
        })}
        
        {insights && insights.length > 0 && computedInsights.length === 0 && insights.map((insight, i) => (
          <div
            key={`legacy-${i}`}
            className="flex flex-col bg-[var(--surface)] border border-[var(--border)] shadow-sm rounded-2xl p-6"
          >
            <div className="flex items-start gap-5 mb-6">
              <span className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center bg-[var(--bg)] border border-[var(--border)] text-[var(--ink)]">
                <MaterialIcon icon="insights" className="text-[24px]" />
              </span>
              <div className="flex-1 min-w-0">
                <h3 className="text-[16px] font-bold text-[var(--ink)]">{insight.label}</h3>
                <p className="text-[14px] text-[var(--muted)] mt-1.5 leading-relaxed">{insight.suffix}</p>
              </div>
              <span className="text-[24px] font-black text-[var(--ink)] shrink-0">
                {insight.value}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
