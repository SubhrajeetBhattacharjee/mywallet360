import { useCallback, useEffect, useMemo, useState } from 'react'
import { ArrowLeftRight, ArrowDownLeft, ArrowUpRight, Hexagon, Search, Filter, ChevronLeft, ChevronRight, ChevronDown, Check, Copy } from 'lucide-react'
import { walletService } from '../../services/walletService'
import {
  TX_TABLE_TABS,
  formatEthAmount,
  resolveAddressLabel,
} from './transactionTable.utils'
import {
  AddressCellWithTooltip,
  AgeCellWithTooltip,
  AmountCellWithTooltip,
  DirectionBadgeWithTooltip,
  FeeCellWithTooltip,
  HashLinkWithTooltip,
  MethodBadgeWithTooltip,
} from './transactionTooltipViews'

const PAGE_SIZE = 10

function CopyButton({ value, label }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async (event) => {
    event.stopPropagation()
    if (!value) return
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1500)
    } catch {
      /* silent */
    }
  }

  return (
    <button
      type="button"
      className="p-1 border-0 bg-transparent text-[var(--muted)] hover:text-[var(--ink)] transition-colors cursor-pointer"
      aria-label={label}
      title={label}
      onClick={handleCopy}
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
    </button>
  )
}

export function TransactionsExplorer({
  wallet,
  analysisDays,
  customRange,
}) {
  const walletAddress = wallet?.id
  const ensLabel = wallet?.profile?.wallet
  const transactionCount = wallet?.transactionCount
  const transactionCountIsLowerBound = wallet?.transactionCountIsLowerBound
  const nftTransferCount = wallet?.nftBreakdown?.total || 0

  const [activeTab, setActiveTab] = useState('normal')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(PAGE_SIZE)
  const [sort, setSort] = useState('age')
  const [order, setOrder] = useState('desc')
  const [rows, setRows] = useState([])
  const [hasMore, setHasMore] = useState(false)
  const [paginationMode, setPaginationMode] = useState('server')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const loadRows = useCallback(async () => {
    if (!walletAddress) return
    setIsLoading(true)
    setError('')

    try {
      const payload = await walletService.getWalletTransactions(walletAddress, {
        type: activeTab,
        page,
        limit: pageSize,
        analysisDays,
        customRange,
        sort,
        order,
      })

      setRows(payload.rows || [])
      setHasMore(Boolean(payload.hasMore))
      setPaginationMode(payload.paginationMode || 'server')
    } catch (requestError) {
      setRows([])
      setHasMore(false)
      setError(requestError.message || 'Unable to load transactions.')
    } finally {
      setIsLoading(false)
    }
  }, [walletAddress, activeTab, page, pageSize, sort, order, analysisDays, customRange])

  useEffect(() => {
    loadRows()
  }, [loadRows])

  useEffect(() => {
    setPage(1)
  }, [analysisDays, customRange])

  const totalTxns = wallet?.transactionCount || '0'
  const incoming = wallet?.flow?.categories?.find(c => c.label === 'Incoming')?.value || '—'
  const outgoing = wallet?.flow?.categories?.find(c => c.label === 'Outgoing')?.value || '—'
  const rUsd = wallet?.flow?.received?.usdAmount || 0
  const sUsd = wallet?.flow?.spent?.usdAmount || 0
  const totalVol = rUsd + sUsd > 0 ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(rUsd + sUsd) : '—'
  
  const periodLabel = analysisDays === 'ytd' ? 'YTD' : customRange ? 'Custom' : `${analysisDays} Days`

  return (
    <div className="flex-1 w-full max-w-[1200px] mx-auto pb-10" style={{ fontFamily: "'Inter', 'DM Sans', system-ui, sans-serif" }}>
      
      {/* Header & Summary */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10 mt-2">
        <div className="max-w-[500px]">
          <h1 className="text-[32px] font-extrabold tracking-tight text-[var(--ink)] mb-2 leading-none">Transactions</h1>
          <p className="text-[15px] text-[var(--muted)] leading-snug">Explore all transactions, token transfers, internal transactions, and more.</p>
        </div>

        <div className="flex items-center gap-6 bg-[var(--surface)] px-6 py-4 rounded-[16px] border border-[var(--border)] shadow-sm shrink-0 overflow-x-auto">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#18c5c0]/15 text-[var(--primary)] flex items-center justify-center shrink-0">
              <ArrowLeftRight size={16} strokeWidth={2.5} />
            </div>
            <div>
              <div className="text-[11px] font-bold text-[var(--muted)] uppercase tracking-wide">Transactions ({periodLabel})</div>
              <div className="text-[15px] font-bold text-[var(--ink)]">{totalTxns}</div>
            </div>
          </div>
          <div className="w-px h-10 bg-[var(--bg)] mx-2 shrink-0"></div>
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#18c5c0]/15 text-[var(--primary)] flex items-center justify-center shrink-0">
              <ArrowDownLeft size={16} strokeWidth={2.5} />
            </div>
            <div>
              <div className="text-[11px] font-bold text-[var(--muted)] uppercase tracking-wide">Incoming</div>
              <div className="text-[15px] font-bold text-[var(--ink)]">{incoming}</div>
            </div>
          </div>
          <div className="w-px h-10 bg-[var(--bg)] mx-2 shrink-0"></div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#18c5c0]/15 text-[var(--primary)] flex items-center justify-center shrink-0">
              <ArrowUpRight size={16} strokeWidth={2.5} />
            </div>
            <div>
              <div className="text-[11px] font-bold text-[var(--muted)] uppercase tracking-wide">Outgoing</div>
              <div className="text-[15px] font-bold text-[var(--ink)]">{outgoing}</div>
            </div>
          </div>
          <div className="w-px h-10 bg-[var(--bg)] mx-2 shrink-0"></div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#18c5c0]/15 text-[var(--primary)] flex items-center justify-center shrink-0">
              <Hexagon size={16} strokeWidth={2.5} />
            </div>
            <div>
              <div className="text-[11px] font-bold text-[var(--muted)] uppercase tracking-wide">Total Volume</div>
              <div className="text-[15px] font-bold text-[var(--ink)]">{totalVol}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-6">
        <div className="flex bg-[var(--surface)] rounded-xl p-1 border border-[var(--border)] shadow-sm overflow-x-auto hide-scrollbar w-fit">
          {TX_TABLE_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id)
                setPage(1)
              }}
              className={`px-4 py-2 rounded-lg font-semibold text-[13px] whitespace-nowrap transition-colors border-none cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#18c5c0]/15 text-[var(--primary)]'
                  : 'bg-transparent text-[var(--muted)] hover:text-[var(--ink)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 overflow-x-auto hide-scrollbar pb-1 xl:pb-0">
          <div className="relative shrink-0">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted)]" size={16} />
            <input 
              type="text" 
              placeholder="Search by address, token, or tx hash..." 
              className="pl-9 pr-4 py-2.5 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-[13px] font-semibold text-[var(--ink)] placeholder:text-[var(--muted)] w-[260px] focus:outline-none focus:border-[#14b8a6] shadow-sm"
            />
          </div>
          <button className="flex items-center gap-2 bg-[var(--surface)] border border-[var(--border)] px-4 py-2.5 rounded-xl font-semibold text-[13px] text-[var(--ink)] cursor-pointer shadow-sm shrink-0 hover:bg-[var(--bg)] transition-colors">
            <Filter size={16} className="text-[var(--muted)]" />
            Filters
          </button>
        </div>
      </div>

      {/* Table Area */}
      <div className="bg-[var(--surface)] rounded-[20px] border border-[var(--border)] shadow-md overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-max xl:min-w-full">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="py-3 px-3 text-[12px] font-bold text-[var(--ink)] w-[40px]">Type</th>
                <th className="py-3 px-3 text-[12px] font-bold text-[var(--ink)]">Hash</th>
                <th className="py-3 px-3 text-[12px] font-bold text-[var(--ink)]">Method</th>
                <th className="py-3 px-3 text-[12px] font-bold text-[var(--ink)]">From</th>
                <th className="py-3 px-3 text-[12px] font-bold text-[var(--ink)]">To</th>
                <th className="py-3 px-3 text-[12px] font-bold text-[var(--ink)]">Asset / Token</th>
                <th className="py-3 px-3 text-[12px] font-bold text-[var(--ink)]">Amount</th>
                <th className="py-3 px-3 text-[12px] font-bold text-[var(--ink)]">Value (USD)</th>
                <th className="py-3 px-3 text-[12px] font-bold text-[var(--ink)]">Fee (ETH)</th>
                <th className="py-3 px-3 text-[12px] font-bold text-[var(--ink)]">
                  <div className="flex items-center gap-1 cursor-pointer">
                    Time
                    <ArrowDownLeft size={12} className="rotate-[-45deg] text-[var(--muted)]" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={`skel-${i}`} className="border-b border-[var(--border)] last:border-0">
                    <td className="py-3 px-3"><div className="w-6 h-6 rounded-full bg-[var(--bg)] animate-pulse"></div></td>
                    <td className="py-3 px-3"><div className="h-4 w-24 bg-[var(--bg)] rounded animate-pulse"></div></td>
                    <td className="py-3 px-3"><div className="h-6 w-16 bg-[var(--bg)] rounded-full animate-pulse"></div></td>
                    <td className="py-3 px-3"><div className="h-4 w-20 bg-[var(--bg)] rounded animate-pulse"></div></td>
                    <td className="py-3 px-3"><div className="h-4 w-20 bg-[var(--bg)] rounded animate-pulse"></div></td>
                    <td className="py-3 px-3"><div className="h-4 w-12 bg-[var(--bg)] rounded animate-pulse"></div></td>
                    <td className="py-3 px-3"><div className="h-4 w-16 bg-[var(--bg)] rounded animate-pulse"></div></td>
                    <td className="py-3 px-3"><div className="h-4 w-12 bg-[var(--bg)] rounded animate-pulse"></div></td>
                    <td className="py-3 px-3"><div className="h-4 w-12 bg-[var(--bg)] rounded animate-pulse"></div></td>
                    <td className="py-3 px-3"><div className="h-4 w-20 bg-[var(--bg)] rounded animate-pulse"></div></td>
                  </tr>
                ))
              )}
              
              {!isLoading && error && (
                <tr>
                  <td colSpan={10} className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <span className="text-[14px] font-medium text-red-500">{error}</span>
                      <button 
                        onClick={() => loadRows()}
                        className="px-4 py-2 bg-[var(--bg)] text-[var(--muted)] rounded-lg text-[13px] font-semibold hover:bg-[var(--bg)] cursor-pointer"
                      >
                        Retry Loading Transactions
                      </button>
                    </div>
                  </td>
                </tr>
              )}
              
              {!isLoading && !error && rows.length === 0 && (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-[var(--muted)] text-[14px]">No transactions found for this view.</td>
                </tr>
              )}
              
              {!isLoading && rows.map((row, i) => (
                <tr key={`${row.hash}-${i}`} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--bg)] transition-colors group">
                  <td className="py-2.5 px-3">
                    <div className="w-6 h-6 flex items-center justify-center shrink-0">
                      {row.direction === 'IN' && <div className="text-[#14b8a6]"><ArrowDownLeft size={16} /></div>}
                      {row.direction === 'OUT' && <div className="text-[var(--muted)]"><ArrowUpRight size={16} /></div>}
                      {row.direction !== 'IN' && row.direction !== 'OUT' && <div className="text-[var(--muted)]"><ArrowLeftRight size={16} /></div>}
                    </div>
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-1.5">
                      <HashLinkWithTooltip hash={row.hash} />
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <CopyButton value={row.hash} label="Copy hash" />
                      </div>
                    </div>
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="inline-flex items-center px-2 py-0.5 rounded-full bg-[var(--bg)] text-[var(--muted)] text-[11px] font-bold tracking-wide">
                      <MethodBadgeWithTooltip methodDisplay={row.methodDisplay || row.method} contractTriggered={row.contractTriggered} />
                    </div>
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-1.5 text-[13px] font-semibold text-[var(--ink)] whitespace-nowrap">
                      <AddressCellWithTooltip address={row.from} walletAddress={walletAddress} ensLabel={ensLabel} />
                    </div>
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-1.5 text-[13px] font-semibold text-[var(--ink)] whitespace-nowrap">
                      <AddressCellWithTooltip address={row.to} walletAddress={walletAddress} ensLabel={ensLabel} />
                    </div>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="text-[13px] font-bold text-[var(--ink)] whitespace-nowrap">{row.amountSymbol || '—'}</span>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="text-[13px] font-bold text-[var(--ink)] whitespace-nowrap">
                      <AmountCellWithTooltip row={row} />
                    </span>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="text-[13px] font-semibold text-[var(--muted)] whitespace-nowrap">{row.usdValue ? `$${row.usdValue.toFixed(2)}` : '—'}</span>
                  </td>
                  <td className="py-2.5 px-3 text-[13px] text-[var(--muted)] whitespace-nowrap">
                    <FeeCellWithTooltip feeEth={row.feeEth} formatEthAmount={formatEthAmount} />
                  </td>
                  <td className="py-2.5 px-3 text-[13px] font-semibold text-[var(--muted)] whitespace-nowrap">
                    <AgeCellWithTooltip timestamp={row.timestamp} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Bar */}
        <div className="border-t border-[var(--border)] px-6 py-4 flex items-center justify-between bg-[var(--surface)] mt-auto">
          <div className="text-[13px] font-semibold text-[var(--muted)]">
            Showing {(page - 1) * pageSize + (rows.length > 0 ? 1 : 0)}–{Math.min(page * pageSize, totalTxns === '—' ? 999999 : totalTxns)} of {totalTxns} transactions
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="w-8 h-8 flex items-center justify-center rounded-lg border-none bg-transparent text-[var(--muted)] cursor-pointer hover:bg-[var(--bg)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} />
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg border-none bg-[#f0fdfa] text-[#14b8a6] font-bold text-[13px] cursor-pointer">
                {page}
              </button>
              <button 
                onClick={() => setPage(p => p + 1)}
                disabled={!hasMore}
                className="w-8 h-8 flex items-center justify-center rounded-lg border-none bg-transparent text-[var(--muted)] cursor-pointer hover:bg-[var(--bg)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight size={16} />
              </button>
            </div>
            
            <div className="flex items-center gap-2 text-[13px] font-semibold text-[var(--muted)]">
              Rows per page
              <button className="flex items-center gap-1 bg-[var(--surface)] border border-[var(--border)] px-2 py-1.5 rounded-lg text-[var(--ink)] cursor-pointer shadow-[0_1px_4px_rgba(15,23,42,0.02)]">
                {pageSize}
                <ChevronDown size={14} className="text-[var(--muted)]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
