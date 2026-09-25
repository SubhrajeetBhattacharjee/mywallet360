import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Area,
  AreaChart,
  Bar,
  Brush,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { MaterialIcon } from '../common/MaterialIcon'
import {
  ANALYTICS_TABS,
  DEFAULT_ANALYTICS_RANGE,
  buildRangedChartData,
  computeSoftYDomain,
  createHiddenSeriesState,
  formatAnalyticsDate,
  formatAxisTick,
  formatSeriesValue,
  formatUsdValue,
  getAxisUnitForTab,
  getChartTypeForTab,
  getPrimarySeriesKey,
  getRangeWindow,
  getSeriesForTab,
  getYearBoundaryDates,
  hasSeriesActivity,
  isSeriesHidden,
  makeUniqueYTickFormatter,
  maybeBucketWeekly,
  normalizeDailyRow,
  SERIES_COLORS,
  summarizeSeries,
  toggleHiddenSeries,
} from './transactionAnalytics.utils'

/** Brush needs enough categories to be worth the vertical space it costs. */
const MIN_POINTS_FOR_BRUSH = 6

function useCompactViewport(maxWidth = 700) {
  const [isCompact, setIsCompact] = useState(() => (
    typeof window !== 'undefined' ? window.matchMedia(`(max-width: ${maxWidth}px)`).matches : false
  ))

  useEffect(() => {
    const media = window.matchMedia(`(max-width: ${maxWidth}px)`)
    const update = () => setIsCompact(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [maxWidth])

  return isCompact
}

function AnalyticsTooltip({
  active,
  payload,
  label,
  series,
  softMax,
  clipped,
  coordinate,
  viewBox,
  hiddenKeys = [],
  fullData = [],
}) {
  if (!active || !payload?.length) return null

  const point = payload[0]?.payload
  if (!point) return null

  const visibleSeries = series.filter((item) => !hiddenKeys.includes(item.key))
  if (!visibleSeries.length) return null

  const chartLeft = viewBox?.x ?? 0
  const chartWidth = viewBox?.width ?? 0
  const cursorX = coordinate?.x ?? chartLeft
  const placeLeft = chartWidth > 0 && cursorX > chartLeft + chartWidth * 0.55
  const allZero = visibleSeries.every((item) => !(Number(point[item.key]) || 0))

  // Find previous point for percentage change
  const currentIndex = fullData.findIndex(d => d.date === point.date)
  const prevPoint = currentIndex > 0 ? fullData[currentIndex - 1] : null

  return (
    <div className={`bg-[var(--surface)] border border-[var(--border)] shadow-xl shadow-[#0f172a]/[0.05] rounded-xl p-4 flex flex-col gap-2.5 min-w-[200px] transition-all duration-200 ${placeLeft ? '-translate-x-[calc(100%+32px)]' : ''}`}>
      <span className="text-[11.5px] font-bold text-[var(--muted)] uppercase tracking-wider border-b border-[var(--border)] pb-2 mb-1">
        {formatAnalyticsDate(label || point.date, { year: 'numeric' })}
      </span>
      {allZero ? (
        <div className="text-[13px] font-semibold text-[var(--muted)] italic">No activity on this day</div>
      ) : visibleSeries.map((item) => {
        const raw = Number(point[item.key]) || 0
        const prevRaw = prevPoint ? (Number(prevPoint[item.key]) || 0) : null
        const exceeds = clipped && softMax > 0 && raw > softMax
        
        let pctChange = null
        if (prevRaw !== null) {
          if (prevRaw === 0 && raw > 0) pctChange = 100
          else if (prevRaw > 0) pctChange = ((raw - prevRaw) / prevRaw) * 100
        }

        return (
          <div key={item.key} className="flex flex-col gap-1">
            <div className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-2 text-[13px] font-semibold text-[var(--muted)]">
                <i className="w-2.5 h-2.5 rounded-full" style={{ background: item.color, boxShadow: `0 0 8px ${item.color}80` }} />
                {item.label}
              </span>
              <strong className="text-[14px] font-extrabold text-[var(--ink)] whitespace-nowrap">
                {formatSeriesValue(item.key, raw)}
              </strong>
            </div>
            {pctChange !== null && pctChange !== 0 && (
              <div className={`text-[10.5px] font-bold self-end flex items-center gap-1 ${pctChange > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                {pctChange > 0 ? '↗' : '↘'} {Math.abs(pctChange).toFixed(1)}% vs prev day
              </div>
            )}
            {exceeds && <span className="text-[10px] text-amber-500 font-bold self-end uppercase">(Above Scale)</span>}
          </div>
        )
      })}
    </div>
  )
}

function InteractiveLegend({ series, tabId, hiddenByTab, onToggle, isPhone }) {
  return (
    <div className="flex flex-wrap items-center gap-2 mb-6" aria-label="Series legend">
      {series.map((item) => {
        const hidden = isSeriesHidden(hiddenByTab, tabId, item.key)
        return (
          <button
            key={item.key}
            type="button"
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[13px] font-semibold transition-all cursor-pointer border ${
              hidden 
                ? 'bg-transparent border-[var(--border)] text-[var(--muted)] hover:bg-[var(--bg)]' 
                : 'bg-[var(--surface)] border-[var(--border)] text-[var(--ink)] shadow-sm shadow-[#0f172a]/[0.02] hover:bg-[var(--bg)]'
            }`}
            aria-pressed={!hidden}
            title={hidden ? `Show ${item.label}` : `Hide ${item.label}`}
            onClick={() => onToggle(item.key)}
          >
            <i className={`w-2 h-2 rounded-full transition-opacity ${hidden ? 'opacity-40' : 'opacity-100'}`} style={{ background: item.color }} />
            <span>{isPhone ? item.label.replace(' Address', '') : item.label}</span>
          </button>
        )
      })}
    </div>
  )
}

function FeeStatCards({ rows, ethPrice, isPhone, hiddenKeys }) {
  const spentTotal = rows.reduce((sum, row) => sum + (Number(row.ethFeesSpent ?? row.ethFees) || 0), 0)
  const usedTotal = rows.reduce((sum, row) => sum + (Number(row.ethFeesUsed) || 0), 0)

  const cards = [
    {
      key: 'ethFeesSpent',
      label: isPhone ? 'Fees Spent' : 'Total Fees Spent (as sender)',
      total: spentTotal,
      accent: SERIES_COLORS.ethFeesSpent,
    },
    {
      key: 'ethFeesUsed',
      label: isPhone ? 'Fees Used' : 'Total Fees Used (as recipient)',
      total: usedTotal,
      accent: SERIES_COLORS.ethFeesUsed,
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      {cards.map((card) => {
        const usd = formatUsdValue(card.total, ethPrice)
        const dimmed = hiddenKeys.includes(card.key)
        return (
          <div
            key={card.key}
            className={`bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 shadow-sm flex flex-col gap-1 transition-opacity ${dimmed ? 'opacity-40' : 'opacity-100'}`}
          >
            <div className="flex items-center gap-2 mb-1">
              <i className="w-2.5 h-2.5 rounded-full" style={{ background: card.accent }} />
              <span className="text-[12px] font-bold text-[var(--muted)] uppercase tracking-wider">{card.label}</span>
            </div>
            <strong className="text-[24px] font-extrabold text-[var(--ink)] tracking-tight">{formatSeriesValue(card.key, card.total)}</strong>
            <small className="text-[13px] font-medium text-[var(--muted)] mt-1">{usd ? `${usd} at current price` : 'USD value unavailable'}</small>
          </div>
        )
      })}
    </div>
  )
}

function BrushTraveller(props) {
  const { x, y, width, height } = props
  const cx = x + width / 2
  const barHeight = Math.max(12, height - 8)
  const barY = y + (height - barHeight) / 2

  return (
    <g className="analytics-brush-traveller">
      <rect
        x={cx - 8}
        y={y}
        width={16}
        height={height}
        fill="transparent"
        style={{ cursor: 'ew-resize' }}
      />
      <rect
        x={cx - 1}
        y={barY}
        width={2}
        height={barHeight}
        rx={1}
        fill="var(--series-primary)"
      />
      <circle
        cx={cx}
        cy={y + height / 2}
        r={3.5}
        fill="var(--series-primary)"
        stroke="var(--card)"
        strokeWidth={1.5}
      />
    </g>
  )
}

function compactAddress(value) {
  if (!value || value.length < 12) return value
  if (!value.startsWith('0x')) return value
  return `${value.slice(0, 6)}…${value.slice(-4)}`
}

function renderSeries({
  chartType,
  series,
  hiddenByTab,
  tabId,
  primaryKey,
  isPhone,
  maxBarSize,
}) {
  return series.map((item) => {
    const hidden = isSeriesHidden(hiddenByTab, tabId, item.key)
    const strokeWidth = item.key === primaryKey ? (isPhone ? 2 : 2.25) : (isPhone ? 1.5 : 2)
    const activeDot = { r: isPhone ? 3 : 4, strokeWidth: 2, stroke: 'var(--card)', fill: item.color }
    const isBar = chartType === 'bar' || (chartType === 'combo' && item.chartType !== 'line')

    if (isBar) {
      return (
        <Bar
          key={item.key}
          dataKey={item.key}
          name={item.label}
          fill={`url(#analyticsBar-${item.key})`}
          radius={[4, 4, 0, 0]}
          maxBarSize={maxBarSize}
          hide={hidden}
          yAxisId={item.yAxisId || 'left'}
          isAnimationActive={true}
          animationDuration={600}
          legendType="none"
        />
      )
    }

    if (chartType === 'area' && item.chartType !== 'line') {
      return (
        <Area
          key={item.key}
          type="monotone"
          dataKey={item.key}
          name={item.label}
          stroke={item.color}
          strokeWidth={strokeWidth}
          fill={`url(#analyticsFill-${item.key})`}
          hide={hidden}
          yAxisId={item.yAxisId || 'left'}
          isAnimationActive={true}
          animationDuration={800}
          legendType="none"
          activeDot={{ ...activeDot, r: isPhone ? 4 : 5, className: 'animate-pulse' }}
        />
      )
    }

    return (
      <Line
        key={item.key}
        type="monotone"
        dataKey={item.key}
        name={item.label}
        stroke={item.color}
        strokeWidth={strokeWidth}
        dot={false}
        activeDot={{ ...activeDot, r: isPhone ? 4 : 5, className: 'animate-pulse' }}
        hide={hidden}
        yAxisId={item.yAxisId || (chartType === 'combo' ? 'right' : 'left')}
        isAnimationActive={true}
        animationDuration={800}
        legendType="none"
      />
    )
  })
}

export function TransactionAnalytics({ wallet, analysisDays, customRange }) {
  const dailyAnalytics = wallet?.dailyAnalytics || []
  const addressLabel = wallet?.profile?.wallet || wallet?.id
  const sourceLabel = 'MyWallet360'
  const ethPrice = null
  const rangeId = DEFAULT_ANALYTICS_RANGE
  const isCompact = useCompactViewport(700)
  const isPhone = useCompactViewport(480)
  const [tabId, setTabId] = useState('transactions')
  const [userChartType, setUserChartType] = useState(null)
  const [brushIndexes, setBrushIndexes] = useState({ startIndex: 0, endIndex: 0 })
  const [hiddenByTab, setHiddenByTab] = useState(createHiddenSeriesState)

  const series = useMemo(() => getSeriesForTab(tabId), [tabId])
  const chartType = useMemo(() => userChartType || getChartTypeForTab(tabId), [userChartType, tabId])
  const activeTab = ANALYTICS_TABS.find((tab) => tab.id === tabId) || ANALYTICS_TABS[0]
  const primaryKey = getPrimarySeriesKey(tabId)
  const primaryColor = series[0]?.color || SERIES_COLORS.transactions
  const yTickFormatter = useMemo(() => makeUniqueYTickFormatter(tabId), [tabId])
  const rightTickFormatter = useMemo(() => makeUniqueYTickFormatter('tokens'), [])
  const hiddenKeys = hiddenByTab[tabId] || []

  const visibleSeries = useMemo(
    () => series.filter((item) => !hiddenKeys.includes(item.key)),
    [series, hiddenKeys],
  )

  const { data: chartData, bucketed } = useMemo(() => {
    const normalized = [...(dailyAnalytics || [])]
      .map(normalizeDailyRow)
      .sort((a, b) => (a.date < b.date ? -1 : 1))
    const ranged = buildRangedChartData(normalized, rangeId)
    const bucketedResult = maybeBucketWeekly(ranged)
    return {
      data: bucketedResult.data.map(normalizeDailyRow),
      bucketed: bucketedResult.bucketed,
    }
  }, [dailyAnalytics, rangeId])

  useEffect(() => {
    if (!chartData.length) {
      setBrushIndexes({ startIndex: 0, endIndex: 0 })
      return
    }
    setBrushIndexes({ startIndex: 0, endIndex: chartData.length - 1 })
  }, [chartData, tabId])

  const visibleRows = useMemo(() => {
    if (!chartData.length) return []
    const start = Math.max(0, brushIndexes.startIndex || 0)
    const end = Math.min(chartData.length - 1, brushIndexes.endIndex ?? chartData.length - 1)
    return chartData.slice(start, end + 1)
  }, [brushIndexes, chartData])

  // Every series keeps a chip so toggling never reflows the row; hidden ones dim.
  const summary = useMemo(
    () => summarizeSeries(visibleRows, series),
    [visibleRows, series],
  )

  const yearBoundaries = useMemo(
    () => getYearBoundaryDates(visibleRows),
    [visibleRows],
  )
  const spansMultipleYears = yearBoundaries.length > 0

  const yScale = useMemo(() => {
    const leftVisible = visibleSeries.filter((item) => item.yAxisId !== 'right').map((item) => item.key)
    const leftKeys = leftVisible.length
      ? leftVisible
      : series.filter((item) => item.yAxisId !== 'right').map((item) => item.key)
    return computeSoftYDomain(visibleRows, leftKeys)
  }, [visibleRows, visibleSeries, series])

  /**
   * The right axis must stay mounted while any series still points at it,
   * otherwise recharts resolves a missing axis for that series. Scale it to the
   * visible right-hand series, falling back to all of them when they're hidden.
   */
  const rightYScale = useMemo(() => {
    const rightSeries = series.filter((item) => item.yAxisId === 'right')
    if (!rightSeries.length) return null
    const shown = rightSeries.filter((item) => !hiddenKeys.includes(item.key))
    const keys = (shown.length ? shown : rightSeries).map((item) => item.key)
    return computeSoftYDomain(visibleRows, keys)
  }, [visibleRows, series, hiddenKeys])

  const hasActivity = useMemo(
    () => hasSeriesActivity(visibleRows, visibleSeries),
    [visibleRows, visibleSeries],
  )

  const handleLegendToggle = useCallback((seriesKey) => {
    setHiddenByTab((current) => toggleHiddenSeries(current, tabId, seriesKey))
  }, [tabId])

  const brushStartLabel = visibleRows[0]
    ? formatAnalyticsDate(visibleRows[0].date, { year: 'numeric' })
    : null
  const brushEndLabel = visibleRows[visibleRows.length - 1]
    ? formatAnalyticsDate(visibleRows[visibleRows.length - 1].date, { year: 'numeric' })
    : null

  if (!dailyAnalytics?.length || !chartData.length) return (
    <div className="card analytics-card p-5 max-[480px]:p-3.5 flex items-center justify-center min-h-[400px]">
      <p className="text-[var(--muted)]">No analytics data available for this period.</p>
    </div>
  )

  const titleAddress = isCompact ? compactAddress(addressLabel) : (addressLabel || 'wallet')
  const rangeWindow = getRangeWindow(rangeId)
  const isDualAxis = chartType === 'combo' && Boolean(rightYScale)
  const usesBars = chartType === 'bar' || chartType === 'combo'
  const showBrush = chartData.length > MIN_POINTS_FOR_BRUSH && Boolean(primaryKey)

  const axisWidth = isPhone ? 36 : isCompact ? 42 : 52
  const maxBarSize = isPhone ? 9 : isCompact ? 13 : 18
  const chartMargin = {
    top: isPhone ? 8 : 12,
    right: isDualAxis ? 0 : (isPhone ? 8 : 14),
    bottom: 0,
    left: 0,
  }

  const leftAxisLabel = getAxisUnitForTab(tabId)
  const leftTickColor = isDualAxis ? primaryColor : 'var(--muted)'
  const showGenericSummary = tabId !== 'fees' && summary.length > 0
  const allSeriesHidden = visibleSeries.length === 0

  return (
    <section className="bg-[var(--surface)] border border-[var(--border)] shadow-md rounded-3xl p-8 mb-8" style={{ fontFamily: "'Inter', 'DM Sans', system-ui, -apple-system, sans-serif" }}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-12 h-12 rounded-xl bg-[#f0fdfa] text-[#14b8a6] flex items-center justify-center shrink-0">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
          </div>
          <div className="min-w-0">
            <span className="text-[12px] font-bold text-[var(--muted)] uppercase tracking-[0.15em] block mb-1">
              Transaction Analytics
            </span>
            <h2 className="text-[20px] font-extrabold text-[var(--ink)] truncate tracking-tight">
              {activeTab.title}{isPhone ? '' : ` for ${titleAddress}`}
            </h2>
            <p className="text-[13px] font-medium text-[var(--muted)] mt-1 flex items-center gap-2">
              {isPhone ? (
                <>
                  {titleAddress}
                  {rangeWindow && (
                    <>
                      {' · '}
                      {formatAnalyticsDate(rangeWindow.start, { month: 'short', day: 'numeric' })}
                      {'–'}
                      {formatAnalyticsDate(rangeWindow.end, { month: 'short', day: 'numeric' })}
                    </>
                  )}
                </>
              ) : (
                <>
                  Source: <strong className="text-[var(--muted)]">{sourceLabel}</strong>
                  {rangeWindow && (
                    <>
                      {' · '}
                      <span className="bg-[var(--bg)] px-2 py-0.5 rounded-md text-[var(--muted)]">
                        {formatAnalyticsDate(rangeWindow.start, { month: 'short', day: 'numeric', year: 'numeric' })}
                        {' – '}
                        {formatAnalyticsDate(rangeWindow.end, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </>
                  )}
                </>
              )}
            </p>
          </div>
        </div>

        <span className="bg-[var(--bg)] border border-[var(--border)] px-3 py-1.5 rounded-lg text-[13px] font-extrabold text-[#18c5c0] tracking-wide uppercase shrink-0" aria-label="Chart range">
          {analysisDays === 'ytd' ? 'YTD' : customRange ? 'Custom' : analysisDays === 'all' ? 'All Time' : `${analysisDays}D`}
        </span>
      </div>

      <div className="flex overflow-x-auto hide-scrollbar mb-8">
        <div className="flex bg-[var(--bg)] rounded-xl p-1 border border-[var(--border)]" role="tablist" aria-label="Analytics metric">
          {ANALYTICS_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={tabId === tab.id}
              className={`px-4 py-2.5 rounded-lg font-bold text-[13px] whitespace-nowrap transition-all duration-300 border-none cursor-pointer ${
                tabId === tab.id
                  ? 'bg-[var(--surface)] text-[#18c5c0] shadow-[0_2px_8px_rgba(15,23,42,0.04)]'
                  : 'bg-transparent text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--surface)]/50'
              }`}
              onClick={() => {
                setTabId(tab.id)
                setUserChartType(null)
              }}
            >
              {isPhone ? tab.label.replace(' Transfers', '') : tab.label}
            </button>
          ))}
        </div>
        
        <div className="flex bg-[var(--bg)] rounded-xl p-1 border border-[var(--border)] ml-auto shrink-0" role="group" aria-label="Chart type">
          {['area', 'bar', 'line'].map((type) => (
            <button
              key={type}
              onClick={() => setUserChartType(type)}
              className={`px-3 py-1.5 rounded-lg text-[12px] font-bold capitalize transition-all duration-300 border-none cursor-pointer ${
                chartType === type
                  ? 'bg-[var(--surface)] text-[var(--ink)] shadow-[0_2px_8px_rgba(15,23,42,0.04)]'
                  : 'bg-transparent text-[var(--muted)] hover:text-[var(--muted)]'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {tabId === 'fees' && (
        <FeeStatCards
          rows={visibleRows}
          ethPrice={ethPrice}
          isPhone={isPhone}
          hiddenKeys={hiddenKeys}
        />
      )}

      {showGenericSummary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {summary.map((item) => (
            <div
              key={item.key}
              className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 shadow-sm flex flex-col gap-1"
            >
              <div className="flex items-center gap-2 mb-1">
                <i className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
                <span className="text-[12px] font-bold text-[var(--muted)] uppercase tracking-wider">{item.label}</span>
              </div>
              <strong className="text-[24px] font-extrabold text-[var(--ink)] tracking-tight">{formatSeriesValue(item.key, item.total)}</strong>
              <small className="text-[13px] font-medium text-[var(--muted)] mt-1">peak {formatSeriesValue(item.key, item.peak)}</small>
            </div>
          ))}
        </div>
      )}

      {(bucketed || yScale.clipped) && !isPhone && (
        <p className="analytics-bucket-note">
          {bucketed && 'Weekly totals for long history. '}
          {yScale.clipped && (
            <>
              Y-axis soft-scaled so spikes do not flatten the chart
              {yScale.trueMax > 0 ? ` (peak ${formatSeriesValue(primaryKey, yScale.trueMax)}).` : '.'}
              {' '}Drag the brush to zoom into quieter periods.
            </>
          )}
        </p>
      )}

      <div
        key={tabId}
        className={`analytics-chart-area${showBrush ? '' : ' analytics-chart-area--no-brush'}`}
        role="img"
        aria-label={`${activeTab.title} chart showing ${visibleSeries.map((item) => item.label).join(', ') || 'no series'}`}
      >
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={chartMargin} barCategoryGap="20%" barGap={2}>
            <defs>
              {series.map((item) => (
                <linearGradient key={`fill-${item.key}`} id={`analyticsFill-${item.key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={item.color} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={item.color} stopOpacity={0.02} />
                </linearGradient>
              ))}
              {series.map((item) => (
                <linearGradient key={`bar-${item.key}`} id={`analyticsBar-${item.key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={item.color} stopOpacity={0.95} />
                  <stop offset="100%" stopColor={item.color} stopOpacity={0.62} />
                </linearGradient>
              ))}
              <linearGradient id="analyticsBrushFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={primaryColor} stopOpacity={0.22} />
                <stop offset="100%" stopColor={primaryColor} stopOpacity={0.04} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="2 5" stroke="var(--chart-grid)" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fontSize: isPhone ? 8 : 9, fill: 'var(--muted)' }}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(d) => formatAxisTick(d, { showYear: spansMultipleYears && !isPhone })}
              interval="preserveStartEnd"
              minTickGap={isPhone ? 24 : isCompact ? 32 : 40}
            />
            <YAxis
              yAxisId="left"
              tick={{ fontSize: isPhone ? 8 : 9, fill: leftTickColor }}
              tickLine={false}
              axisLine={false}
              width={axisWidth}
              domain={yScale.domain}
              allowDataOverflow={false}
              tickFormatter={yTickFormatter}
              label={isCompact ? undefined : {
                value: leftAxisLabel,
                angle: -90,
                position: 'insideLeft',
                style: { fill: primaryColor, fontSize: 9, fontWeight: 700 },
              }}
            />
            {isDualAxis && (
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fontSize: isPhone ? 8 : 9, fill: SERIES_COLORS.tokenContractsCount }}
                tickLine={false}
                axisLine={false}
                width={axisWidth}
                domain={rightYScale.domain}
                allowDataOverflow={false}
                tickFormatter={rightTickFormatter}
                label={isCompact ? undefined : {
                  value: 'Contracts',
                  angle: 90,
                  position: 'insideRight',
                  style: { fill: SERIES_COLORS.tokenContractsCount, fontSize: 9, fontWeight: 700 },
                }}
              />
            )}
            {!isPhone && yearBoundaries.map((boundary) => (
              <ReferenceLine
                key={`year-${boundary.year}`}
                yAxisId="left"
                x={boundary.date}
                stroke="var(--line)"
                strokeDasharray="4 4"
                label={{
                  value: String(boundary.year),
                  position: 'insideTopLeft',
                  fill: 'var(--muted)',
                  fontSize: 10,
                  fontWeight: 700,
                }}
              />
            ))}
            <Tooltip
              allowEscapeViewBox={{ x: true, y: true }}
              wrapperStyle={{ zIndex: 20, outline: 'none' }}
              isAnimationActive={true}
              animationDuration={300}
              content={(
                <AnalyticsTooltip
                  series={series}
                  hiddenKeys={hiddenKeys}
                  softMax={yScale.softMax}
                  clipped={yScale.clipped}
                  fullData={chartData}
                />
              )}
              cursor={usesBars
                ? { fill: 'var(--chart-cursor)', radius: 4 }
                : { stroke: 'var(--muted)', strokeDasharray: '3 3', opacity: 0.4 }}
            />
            {renderSeries({
              chartType,
              series,
              hiddenByTab,
              tabId,
              primaryKey,
              isPhone,
              maxBarSize,
            })}
            {showBrush && (
              <Brush
                dataKey="date"
                height={isPhone ? 26 : 34}
                stroke="transparent"
                fill="var(--chart-cursor)"
                travellerWidth={isPhone ? 14 : 12}
                traveller={<BrushTraveller />}
                tickFormatter={() => ''}
                startIndex={brushIndexes.startIndex}
                endIndex={brushIndexes.endIndex}
                onChange={(next) => {
                  if (next?.startIndex == null || next?.endIndex == null) return
                  setBrushIndexes({
                    startIndex: next.startIndex,
                    endIndex: next.endIndex,
                  })
                }}
              >
                <AreaChart>
                  <Area
                    type="monotone"
                    dataKey={primaryKey}
                    stroke={primaryColor}
                    fill="url(#analyticsBrushFill)"
                    strokeWidth={1}
                    strokeOpacity={0.65}
                    isAnimationActive={false}
                    dot={false}
                  />
                </AreaChart>
              </Brush>
            )}
          </ComposedChart>
        </ResponsiveContainer>

        {(allSeriesHidden || !hasActivity) && (
          <div className="analytics-chart-empty">
            <MaterialIcon
              icon={allSeriesHidden ? 'visibility_off' : 'show_chart'}
              className="text-lg"
            />
            <span>
              {allSeriesHidden
                ? 'All series hidden — pick one below to show data'
                : 'No activity in this range'}
            </span>
          </div>
        )}
      </div>

      {showBrush && (brushStartLabel || brushEndLabel) && (
        <div className="analytics-brush-dates">
          <span>{brushStartLabel}</span>
          <span>{brushEndLabel}</span>
        </div>
      )}

      <InteractiveLegend
        series={series}
        tabId={tabId}
        hiddenByTab={hiddenByTab}
        onToggle={handleLegendToggle}
        isPhone={isPhone}
      />
    </section>
  )
}
