import React from 'react'
import { Search, ExternalLink, RefreshCw, Sun, ChevronDown, Copy, Hexagon, TrendingUp, ArrowDownLeft, ArrowUpRight, BarChart3, PieChart as PieChartIcon, ArrowLeftRight, Settings2, ArrowRightLeft } from 'lucide-react'

// Common Utils
function Card({ children, className = '' }) {
  return (
    <div className={`bg-[var(--surface)] rounded-2xl shadow-[0_4px_24px_rgba(15,23,42,0.04)] border border-[var(--border)] ${className}`}>
      {children}
    </div>
  )
}

function HandDrawnAnnotation({ text, arrow, className }) {
  return (
    <div className={`absolute z-30 pointer-events-none flex flex-col items-center ${className}`} style={{ fontFamily: "'Caveat', 'Comic Sans MS', cursive" }}>
      <span className="text-[var(--muted)] text-[16px] leading-[1.2] -rotate-3 text-center w-max">{text}</span>
      {arrow === 'down-left' && (
        <svg width="40" height="40" viewBox="0 0 100 100" className="opacity-50 mt-1 ml-4" stroke="currentColor" fill="none" strokeWidth="2">
          <path d="M90 10 Q 50 30 20 80" />
          <path d="M15 65 L 20 80 L 35 75" />
        </svg>
      )}
      {arrow === 'up-right' && (
        <svg width="60" height="60" viewBox="0 0 100 100" className="opacity-50 mt-1 -ml-8" stroke="currentColor" fill="none" strokeWidth="2">
          <path d="M10 90 Q 40 70 80 20" />
          <path d="M65 25 L 80 20 L 75 35" />
        </svg>
      )}
      {arrow === 'up-left' && (
        <svg width="60" height="60" viewBox="0 0 100 100" className="opacity-50 mt-1 ml-8" stroke="currentColor" fill="none" strokeWidth="2">
          <path d="M90 90 Q 60 70 20 20" />
          <path d="M35 25 L 20 20 L 25 35" />
        </svg>
      )}
      {arrow === 'down-right' && (
        <svg width="40" height="40" viewBox="0 0 100 100" className="opacity-50 mt-1 -ml-4" stroke="currentColor" fill="none" strokeWidth="2">
          <path d="M10 10 Q 50 30 80 80" />
          <path d="M85 65 L 80 80 L 65 75" />
        </svg>
      )}
    </div>
  )
}

export function Scene1Mockup() {
  return (
    <div className="relative w-full h-full min-h-[600px] flex items-center justify-center">
      <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] bg-[#ccfbf1] opacity-60 rounded-[40px] rotate-12 blur-3xl" />
      <div className="absolute bottom-[-5%] left-[-5%] w-[350px] h-[350px] bg-[#e0e7ff] opacity-50 rounded-full blur-3xl" />
            {/* 3D Eth Logo Representation */}
      

      {/* Main Dashboard Panel */}
      <div className="bg-[var(--surface)] rounded-[24px] shadow-[0_24px_48px_-12px_rgba(15,23,42,0.1)] border border-[var(--border)] p-6 w-[880px] z-10 relative">
        <div className="absolute -top-12 -right-12 w-[88px] h-[88px] bg-gradient-to-br from-[#f8fafc] to-[#e2e8f0] rounded-full shadow-lg flex items-center justify-center border border-white">
          <svg width="32" height="48" viewBox="0 0 320 512" fill="#334155"><path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"/></svg>
        </div>

        <HandDrawnAnnotation text={<>Real blockchain data.<br/>Real insights.</>} arrow="down-left" className="-top-16 right-32" />
        <HandDrawnAnnotation text={<>Turn any Ethereum address into<br/>a clear, visual dashboard.</>} arrow="up-left" className="-bottom-16 -right-8" />
        
        {/* Search Bar inside Dashboard */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 bg-[var(--bg)] border border-[var(--border)] rounded-xl px-4 py-3 flex items-center gap-3">
            <Search size={16} className="text-[var(--muted)]" />
            <span className="text-[14px] text-[var(--muted)] font-medium flex-1">0xd993F4B344a40f0966C4b18a802322c0A4154875f</span>
            <div className="w-5 h-5 bg-[var(--surface)] border border-[var(--border)] rounded flex items-center justify-center text-[10px] text-[var(--muted)] font-bold">/</div>
          </div>
          <div className="w-11 h-11 bg-[var(--bg)] border border-[var(--border)] rounded-xl flex items-center justify-center text-[var(--muted)]">
            <Sun size={18} />
          </div>
          <div className="bg-[var(--bg)] border border-[var(--border)] rounded-xl px-4 py-3 flex items-center gap-2 text-[14px] font-bold text-[var(--ink)]">
            SB <ChevronDown size={14} className="text-[var(--muted)] ml-1" />
          </div>
        </div>

        <div className="flex justify-between items-start mb-8 px-2">
          <div className="flex items-center gap-4">
            <div className="w-[56px] h-[56px] bg-[var(--bg)] border border-[var(--border)] rounded-2xl flex items-center justify-center">
              <Hexagon size={32} strokeWidth={1} className="text-[#14b8a6]" fill="#ccfbf1" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <h1 className="text-[24px] font-black text-[var(--ink)]">0xd993...875f</h1>
                <Copy size={14} className="text-[var(--muted)]" />
              </div>
              <div className="bg-[#ccfbf1]/50 text-[#14b8a6] text-[11px] font-bold px-2.5 py-0.5 rounded-full inline-block">
                Ethereum
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2.5 mt-1">
            <div className="bg-[var(--ink)] text-white text-[12px] font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 shadow-sm">
              View on Etherscan <ExternalLink size={12} />
            </div>
            <div className="text-[11px] font-medium text-[var(--muted)] flex items-center gap-1.5">
              Last updated: 10:52 <RefreshCw size={12} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-4">
          {[
            { label: 'Portfolio Value', val: '$24.63', sub: 'Estimated priced assets', icon: <TrendingUp size={12}/> },
            { label: 'ETH Balance', val: '0.0099 ETH', sub: '$24.63', icon: <Hexagon size={12}/> },
            { label: 'Wallet Age', val: '2.0 years', sub: 'Since 26/09/2024', icon: <RefreshCw size={12}/> },
            { label: 'Total Transactions', val: '21', sub: 'View all →', icon: <ArrowDownLeft size={12}/> }
          ].map((m, i) => (
            <Card key={i} className="p-5 border-none shadow-[0_2px_12px_rgba(15,23,42,0.03)] bg-[var(--bg)]">
              <div className="text-[11px] font-bold text-[var(--muted)] flex items-center gap-1.5 mb-3">
                {m.icon} {m.label}
              </div>
              <div className="text-[24px] font-black text-[var(--ink)] mb-1">{m.val}</div>
              <div className="text-[11px] font-medium text-[var(--muted)]">{m.sub}</div>
            </Card>
          ))}
        </div>

        <div className="flex gap-4">
          <Card className="flex-1 p-5 border-none shadow-[0_2px_12px_rgba(15,23,42,0.03)] bg-[var(--surface)] border border-[var(--border)] flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <div className="text-[13px] font-bold text-[var(--ink)] flex items-center gap-1.5">
                <TrendingUp size={14} className="text-[#14b8a6]" /> Portfolio Value
              </div>
              <div className="bg-[var(--bg)] text-[var(--muted)] text-[11px] font-bold px-3 py-1 rounded">ALL</div>
            </div>
            <div className="h-[140px] relative border-b border-l border-[var(--border)] ml-8 mb-4">
              {/* Chart Line */}
              <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                <path d="M0,140 L0,30 L100,20 L200,20 L300,120 L400,125 L500,125 L500,140 Z" fill="#ccfbf1" opacity="0.6" />
                <path d="M0,30 L100,20 L200,20 L300,120 L400,125 L500,125" fill="none" stroke="#14b8a6" strokeWidth="2.5" />
              </svg>
              {/* Y-axis Labels */}
              <div className="absolute left-[-35px] top-0 bottom-0 flex flex-col justify-between text-[9px] text-[var(--muted)] font-bold h-[140px] pb-2">
                <span>$260</span><span>$195</span><span>$130</span><span>$65</span><span>$0</span>
              </div>
              <div className="absolute left-0 right-0 bottom-[-20px] flex justify-between text-[9px] text-[var(--muted)] font-bold">
                <span>Jan 18</span><span>Feb 20</span><span>Mar 26</span><span>Apr 28</span><span>Jun 1</span><span>Jul 5</span><span>Aug 7</span><span>Sep 18</span>
              </div>
            </div>
          </Card>
          <Card className="w-[300px] p-5 border-none shadow-[0_2px_12px_rgba(15,23,42,0.03)] bg-[var(--surface)] border border-[var(--border)]">
            <div className="text-[13px] font-bold text-[var(--ink)] flex items-center gap-1.5 mb-8">
              <PieChartIcon size={14} className="text-[#14b8a6]" /> Token Allocation
            </div>
            <div className="flex items-center justify-center gap-8">
              <div className="w-[110px] h-[110px] rounded-full border-[18px] border-[#14b8a6] border-t-[#3b82f6] border-r-[#8b5cf6] border-b-[#ef4444] rotate-45 shadow-[inset_0_2px_6px_rgba(0,0,0,0.05)]" />
              <div className="flex flex-col gap-3">
                {[
                  { c: '#14b8a6', l: 'ETH' },
                  { c: '#3b82f6', l: 'HEX' },
                  { c: '#8b5cf6', l: 'DOG' },
                  { c: '#ef4444', l: 'PAIN' }
                ].map(t => (
                  <div key={t.l} className="flex items-center gap-2 text-[12px] font-bold text-[var(--ink)]">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: t.c }} /> {t.l}
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export function Scene2Mockup() {
  return (
    <div className="relative w-full h-full min-h-[600px] flex flex-col justify-center gap-6">
      <div className="absolute top-[10%] right-[5%] w-[400px] h-[400px] bg-[#e0e7ff] opacity-40 rounded-[40px] rotate-12 blur-3xl" />
      <div className="absolute bottom-[0%] left-[-10%] w-[350px] h-[350px] bg-[#ccfbf1] opacity-50 rounded-full blur-3xl" />

      {/* Main Analytics Panel */}
      <div className="bg-[var(--surface)] rounded-[24px] shadow-[0_24px_48px_-12px_rgba(15,23,42,0.1)] border border-[var(--border)] p-6 w-[880px] z-10 relative mx-auto flex flex-col">
        <HandDrawnAnnotation text={<>Detailed breakdown<br/>of your activity.</>} arrow="up-left" className="-bottom-12 -right-32" />

        {/* Floating Small Panel */}
        <div className="absolute -bottom-16 left-24 bg-[var(--surface)] rounded-2xl shadow-[0_20px_40px_-10px_rgba(15,23,42,0.1)] border border-[var(--border)] p-5 w-[380px] z-20">
          <div className="flex justify-between items-center mb-4">
            <div className="text-[12px] font-bold text-[var(--ink)] flex items-center gap-2">
              <BarChart3 size={14} className="text-[var(--muted)]" /> Top Tokens Transferred
            </div>
            <div className="text-[11px] font-bold text-[var(--muted)]">View all →</div>
          </div>
          <div className="grid grid-cols-[1fr_60px_1fr] text-[9px] font-bold text-[var(--muted)] uppercase tracking-wider mb-2 pb-2 border-b border-[var(--border)]">
            <div>Token</div><div className="text-right">Txns</div><div className="text-right">Volume</div>
          </div>
          {[
            { c: '#1e293b', n: 'ETH', t: '12', v: '0.0099 ETH' },
            { c: '#3b82f6', n: 'HEX', t: '5', v: '10,000 HEX' },
            { c: '#8b5cf6', n: 'DOG', t: '3', v: '420,000,000 DOG' },
            { c: '#ef4444', n: 'PAIN', t: '1', v: '95,000 PAIN' }
          ].map((r,i) => (
            <div key={i} className="grid grid-cols-[1fr_60px_1fr] text-[12px] font-bold text-[var(--ink)] py-2.5 items-center border-b border-[var(--border)]/50 last:border-0">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-white" style={{backgroundColor: r.c}}>
                  <Hexagon size={12} fill="currentColor" />
                </div>
                {r.n}
              </div>
              <div className="text-right">{r.t}</div>
              <div className="text-right">{r.v}</div>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center mb-6 px-2">
          <div className="flex items-center gap-3">
            <BarChart3 size={24} className="text-[#14b8a6]" />
            <div>
              <div className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider mb-0.5">Transaction Analytics</div>
              <div className="flex items-center gap-2">
                <div className="font-bold text-[var(--ink)] text-[16px]">0xd993F4B3...875f</div>
                <Copy size={12} className="text-[var(--muted)]" />
              </div>
            </div>
          </div>
          <div className="bg-[var(--bg)] border border-[var(--border)] rounded-lg px-3 py-1.5 flex items-center gap-2 text-[12px] font-bold text-[var(--ink)]">
            1M <ChevronDown size={14} className="text-[var(--muted)]" />
          </div>
        </div>

        <div className="flex gap-2 border-b border-[var(--border)] pb-4 mb-6">
          <div className="px-4 py-1.5 bg-[#14b8a6] text-white text-[12px] font-bold rounded-full">Transactions</div>
          <div className="px-4 py-1.5 text-[var(--muted)] text-[12px] font-bold">Token Transfers</div>
          <div className="px-4 py-1.5 text-[var(--muted)] text-[12px] font-bold">NFT Transfers</div>
          <div className="px-4 py-1.5 text-[var(--muted)] text-[12px] font-bold">Internal Txns</div>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { l: 'TOTAL TXNS', v: '21', t: '+16.7%', up: true },
            { l: 'INCOMING', v: '14', t: '+27.3%', up: true },
            { l: 'OUTGOING', v: '7', t: '-12.5%', up: false },
            { l: 'UNIQUE TOKENS', v: '4', t: '+33.3%', up: true },
          ].map((m, i) => (
            <div key={i} className="bg-[var(--bg)] p-4 rounded-xl border border-[var(--border)]">
              <div className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider mb-1">{m.l}</div>
              <div className="text-[20px] font-black text-[var(--ink)] mb-1">{m.v}</div>
              <div className={`text-[11px] font-bold flex items-center gap-1 ${m.up ? 'text-[#10b981]' : 'text-[#ef4444]'}`}>
                {m.up ? <ArrowUpRight size={12}/> : <ArrowDownLeft size={12}/>} {m.t}
              </div>
            </div>
          ))}
        </div>

        <div className="flex-1 w-full min-h-[140px] relative mt-8 mb-6 ml-6 border-b border-[var(--border)]">
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 220" preserveAspectRatio="none">
            <path d="M0,150 Q50,100 100,50 T200,120 T300,140 T400,20 T500,100 T600,160 T700,90 T800,180" fill="none" stroke="#14b8a6" strokeWidth="6" />
            <path d="M0,190 Q50,140 100,110 T200,180 T300,100 T400,90 T500,160 T600,190 T700,120 T800,200" fill="none" stroke="#8b5cf6" strokeWidth="4" opacity="0.6" />
            <circle cx="400" cy="20" r="5" fill="#14b8a6" />
            <circle cx="400" cy="100" r="5" fill="#8b5cf6" />
            <line x1="400" y1="20" x2="400" y2="200" stroke="#f1f5f9" strokeWidth="2" strokeDasharray="4 4" />
          </svg>
          
          <div className="absolute left-[360px] top-[-70px] bg-[var(--surface)] border border-[var(--border)] shadow-lg rounded-xl p-3 z-10 w-[120px]">
            <div className="text-[10px] font-bold text-[var(--muted)] mb-2">Sep 15, 2024</div>
            <div className="flex items-center justify-between text-[11px] font-bold text-[var(--ink)] mb-1">
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#14b8a6]"/> Incoming</div>
              <div>6</div>
            </div>
            <div className="flex items-center justify-between text-[11px] font-bold text-[var(--ink)]">
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#8b5cf6]"/> Outgoing</div>
              <div>2</div>
            </div>
          </div>

          <div className="absolute left-[-20px] top-0 bottom-0 flex flex-col justify-between text-[10px] text-[var(--muted)] font-bold pb-2">
            <span>8</span><span>6</span><span>4</span><span>2</span><span>0</span>
          </div>
          <div className="absolute left-0 right-0 bottom-[-25px] flex justify-between text-[10px] text-[var(--muted)] font-bold">
            <span>Sep 1</span><span>Sep 5</span><span>Sep 10</span><span>Sep 15</span><span>Sep 20</span><span>Sep 25</span><span>Sep 30</span>
          </div>
        </div>
        <div className="flex justify-end gap-4 mt-6">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-[var(--muted)]"><div className="w-2.5 h-2.5 rounded-full bg-[#14b8a6]"/> Incoming</div>
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-[var(--muted)]"><div className="w-2.5 h-2.5 rounded-full bg-[#8b5cf6]"/> Outgoing</div>
        </div>
      </div>
    </div>
  )
}

export function Scene3Mockup() {
  return (
    <div className="relative w-full h-full min-h-[600px] flex flex-col justify-center gap-6">
      <div className="absolute top-[10%] right-[10%] w-[350px] h-[350px] bg-[#e0e7ff] opacity-40 rounded-[40px] rotate-12 blur-3xl" />
      <div className="absolute bottom-[5%] left-[5%] w-[400px] h-[400px] bg-[#ccfbf1] opacity-50 rounded-full blur-3xl" />

      {/* Money Flow Panel */}
      <div className="bg-[var(--surface)] rounded-[24px] shadow-[0_24px_48px_-12px_rgba(15,23,42,0.1)] border border-[var(--border)] p-6 w-[880px] z-10 mx-auto flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#f0fdfa] text-[#14b8a6] flex items-center justify-center">
              <ArrowDownLeft size={16} />
            </div>
            <div>
              <div className="text-[14px] font-black text-[var(--ink)]">Money Flow</div>
              <div className="text-[11px] font-medium text-[var(--muted)]">Track the flow of assets in and out of the wallet.</div>
            </div>
          </div>
          <div className="bg-[var(--bg)] border border-[var(--border)] rounded-lg px-3 py-1.5 flex items-center gap-2 text-[12px] font-bold text-[var(--ink)]">
            30D <ChevronDown size={14} className="text-[var(--muted)]" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-[var(--bg)] p-4 rounded-2xl border border-[var(--border)] flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#d1fae5] text-[#10b981] flex items-center justify-center">
              <ArrowDownLeft size={20} strokeWidth={2.5} />
            </div>
            <div>
              <div className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider mb-0.5">Incoming</div>
              <div className="text-[20px] font-black text-[var(--ink)]">$1,482.93</div>
              <div className="text-[10px] font-medium text-[var(--muted)]">12 transactions</div>
            </div>
          </div>
          <div className="bg-[var(--bg)] p-4 rounded-2xl border border-[var(--border)] flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#fee2e2] text-[#ef4444] flex items-center justify-center">
              <ArrowUpRight size={20} strokeWidth={2.5} />
            </div>
            <div>
              <div className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider mb-0.5">Outgoing</div>
              <div className="text-[20px] font-black text-[var(--ink)]">$1,120.21</div>
              <div className="text-[10px] font-medium text-[var(--muted)]">9 transactions</div>
            </div>
          </div>
          <div className="bg-[var(--surface)] p-4 rounded-2xl border border-[var(--border)] shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[var(--bg)] text-[var(--muted)] flex items-center justify-center">
              <ArrowLeftRight size={20} />
            </div>
            <div>
              <div className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider mb-0.5">Net Flow</div>
              <div className="text-[24px] font-black text-[#10b981]">+$362.72</div>
            </div>
          </div>
        </div>

        <div className="relative flex-1 min-h-[140px] flex justify-between items-center px-4 w-full">
          <div className="flex flex-col gap-4 w-[160px] z-10">
            {[
              { l: 'Exchanges', p: '38%' },
              { l: 'DeFi Protocols', p: '27%' },
              { l: 'Individuals', p: '18%' },
              { l: 'Other', p: '17%' },
            ].map(r => (
              <div key={r.l} className="bg-[var(--surface)] border border-[var(--border)] shadow-sm px-4 py-2.5 rounded-xl flex justify-between items-center">
                <span className="text-[11px] font-medium text-[var(--muted)]">{r.l}</span>
                <span className="text-[11px] font-bold text-[var(--ink)]">{r.p}</span>
              </div>
            ))}
          </div>

          <div className="w-[120px] h-[120px] bg-[var(--surface)] rounded-3xl shadow-[0_12px_24px_rgba(15,23,42,0.06)] border border-[var(--border)] flex flex-col items-center justify-center gap-2 z-20">
            <div className="w-12 h-12 bg-[var(--bg)] rounded-2xl flex items-center justify-center">
              <Hexagon fill="#0f172a" stroke="#0f172a" size={24} />
            </div>
            <div className="text-center">
              <div className="text-[12px] font-bold text-[var(--ink)]">Wallet</div>
              <div className="text-[9px] font-medium text-[var(--muted)]">0xd993...875f</div>
            </div>
          </div>

          <div className="flex flex-col gap-4 w-[160px] z-10">
            {[
              { l: 'DeFi Protocols', p: '42%' },
              { l: 'Exchanges', p: '29%' },
              { l: 'Individuals', p: '20%' },
              { l: 'Other', p: '9%' },
            ].map(r => (
              <div key={r.l} className="bg-[var(--surface)] border border-[var(--border)] shadow-sm px-4 py-2.5 rounded-xl flex justify-between items-center">
                <span className="text-[11px] font-medium text-[var(--muted)]">{r.l}</span>
                <span className="text-[11px] font-bold text-[var(--ink)]">{r.p}</span>
              </div>
            ))}
          </div>

          <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
            <path d="M 180 30 Q 300 30 400 100" fill="none" stroke="#10b981" strokeWidth="20" strokeOpacity="0.15" />
            <path d="M 180 80 Q 300 80 400 100" fill="none" stroke="#10b981" strokeWidth="15" strokeOpacity="0.15" />
            <path d="M 180 130 Q 300 130 400 100" fill="none" stroke="#10b981" strokeWidth="10" strokeOpacity="0.15" />
            <path d="M 180 180 Q 300 180 400 100" fill="none" stroke="#10b981" strokeWidth="8" strokeOpacity="0.15" />
            
            <path d="M 440 100 Q 550 30 680 30" fill="none" stroke="#ef4444" strokeWidth="22" strokeOpacity="0.15" />
            <path d="M 440 100 Q 550 80 680 80" fill="none" stroke="#ef4444" strokeWidth="16" strokeOpacity="0.15" />
            <path d="M 440 100 Q 550 130 680 130" fill="none" stroke="#ef4444" strokeWidth="12" strokeOpacity="0.15" />
            <path d="M 440 100 Q 550 180 680 180" fill="none" stroke="#ef4444" strokeWidth="6" strokeOpacity="0.15" />
          </svg>
        </div>
      </div>

      {/* Portfolio Panel */}
      <div className="bg-[var(--surface)] rounded-[24px] shadow-[0_24px_48px_-12px_rgba(15,23,42,0.1)] border border-[var(--border)] p-6 w-[880px] z-10 mx-auto flex items-center relative">
        <HandDrawnAnnotation text={<>A clearer picture<br/>of your portfolio.</>} arrow="up-left" className="-bottom-16 -right-12" />
        
        <div className="flex-1 pr-8 border-r border-[var(--border)]">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-[#e0e7ff] text-[#6366f1] flex items-center justify-center">
              <PieChartIcon size={16} />
            </div>
            <div>
              <div className="text-[14px] font-black text-[var(--ink)]">Portfolio & Holdings</div>
              <div className="text-[11px] font-medium text-[var(--muted)]">See what the wallet holds and how it's distributed.</div>
            </div>
          </div>

          <div className="flex items-center gap-8 pl-4">
            <div className="relative w-[140px] h-[140px]">
              <div className="w-full h-full rounded-full border-[24px] border-[#14b8a6] border-t-[#3b82f6] border-r-[#8b5cf6] border-b-[#ef4444] rotate-45 shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)]" />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-[16px] font-black text-[var(--ink)]">$24.63</div>
                <div className="text-[8px] font-bold text-[var(--muted)] uppercase tracking-wider">Total Value</div>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              {[
                { c: '#14b8a6', l: 'ETH', p: '78.4%' },
                { c: '#3b82f6', l: 'HEX', p: '12.1%' },
                { c: '#8b5cf6', l: 'DOG', p: '6.3%' },
                { c: '#ef4444', l: 'PAIN', p: '2.1%' },
                { c: '#f59e0b', l: 'Other', p: '1.1%' }
              ].map(t => (
                <div key={t.l} className="flex items-center gap-6 justify-between text-[11px] font-bold text-[var(--ink)]">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: t.c }} /> {t.l}
                  </div>
                  <div className="text-[var(--muted)] font-medium">{t.p}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1 pl-8">
          <div className="flex justify-end gap-2 mb-6">
            <div className="bg-[#ccfbf1] text-[#0f766e] text-[11px] font-bold px-4 py-1.5 rounded-full">All Assets</div>
            <div className="text-[var(--muted)] text-[11px] font-bold px-4 py-1.5 rounded-full">Priced Only</div>
            <div className="text-[var(--muted)] text-[11px] font-bold px-4 py-1.5 rounded-full">Unpriced</div>
            <div className="w-8 h-7 bg-[var(--bg)] border border-[var(--border)] rounded flex items-center justify-center text-[var(--muted)] tracking-widest">...</div>
          </div>
          <div className="grid grid-cols-[1fr_1fr_1fr_60px_20px] text-[9px] font-bold text-[var(--muted)] uppercase tracking-wider mb-2 pb-2 border-b border-[var(--border)]">
            <div>Token</div><div>Balance</div><div>Value</div><div className="text-right">Allocation</div><div></div>
          </div>
          {[
            { c: '#1e293b', n: 'ETH', b: '0.0099', v: '$24.63', a: '78.4%' },
            { c: '#3b82f6', n: 'HEX', b: '10,000', v: '$3.80', a: '12.1%' },
            { c: '#8b5cf6', n: 'DOG', b: '420,000,000', v: '$1.97', a: '6.3%' },
            { c: '#ef4444', n: 'PAIN', b: '95,000', v: '$0.66', a: '2.1%' }
          ].map((r,i) => (
            <div key={i} className="grid grid-cols-[1fr_1fr_1fr_60px_20px] text-[11px] font-bold text-[var(--ink)] py-3 items-center border-b border-[var(--border)]/50">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full flex items-center justify-center text-white" style={{backgroundColor: r.c}}>
                  <Hexagon size={10} fill="currentColor" />
                </div>
                {r.n}
              </div>
              <div className="text-[var(--muted)] font-medium">{r.b}</div>
              <div>{r.v}</div>
              <div className="text-right">{r.a}</div>
              <div className="text-right text-[var(--muted)]">...</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function Scene4Mockup() {
  return (
    <div className="relative w-full h-full min-h-[600px] flex flex-col justify-center gap-6">
      <div className="absolute top-[5%] right-[15%] w-[400px] h-[400px] bg-[#ccfbf1] opacity-50 rounded-[40px] rotate-12 blur-3xl" />
      <div className="absolute bottom-[10%] left-[0%] w-[350px] h-[350px] bg-[#e0e7ff] opacity-40 rounded-full blur-3xl" />

      {/* Main Dashboard Panel */}
      <div className="bg-[var(--surface)] rounded-[24px] shadow-[0_24px_48px_-12px_rgba(15,23,42,0.1)] border border-[var(--border)] p-6 w-[880px] z-10 mx-auto relative">
        
        {/* Insights Top Row */}
        <div className="flex gap-6">
          <div className="w-[500px]">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2 text-[14px] font-black text-[var(--ink)]">
                <div className="w-6 h-6 rounded bg-[#ccfbf1] text-[#14b8a6] flex items-center justify-center"><Sun size={14}/></div>
                Wallet Insights
              </div>
              <div className="bg-[var(--bg)] border border-[var(--border)] rounded px-3 py-1 text-[11px] font-bold text-[var(--muted)] flex items-center gap-2">
                0xd993...875f <Copy size={12}/>
              </div>
            </div>
            
            <div className="flex items-center gap-6 mb-6">
              <div className="w-[120px] h-[120px] rounded-full border-[12px] border-[#14b8a6] border-b-[#f1f5f9] -rotate-45 flex items-center justify-center relative">
                <div className="absolute inset-0 flex flex-col items-center justify-center rotate-45">
                  <div className="text-[32px] font-black text-[var(--ink)] leading-none mb-1">72</div>
                  <div className="text-[9px] font-bold text-[var(--muted)] uppercase">Behavior Score</div>
                </div>
              </div>
              
              <div className="flex-1 bg-[var(--bg)] border border-[var(--border)] rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded bg-[#10b981] text-white flex items-center justify-center"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg></div>
                  <div className="text-[18px] font-black text-[var(--ink)]">Holder</div>
                  <div className="bg-[#ccfbf1] text-[#0f766e] text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Primary</div>
                </div>
                <div className="text-[12px] text-[var(--muted)] leading-relaxed font-medium">
                  This wallet is primarily shaped by holding behavior, with more incoming transfers and long-term asset retention.
                </div>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
              <div className="border border-[var(--border)] rounded-xl p-3 bg-[var(--surface)]">
                <div className="flex items-center gap-2 mb-2 text-[var(--muted)]"><ArrowLeftRight size={14}/> <span className="text-[9px] font-bold uppercase tracking-wider">Net Flow</span></div>
                <div className="text-[14px] font-black text-[#10b981] mb-1">+0.42 ETH</div>
                <div className="text-[10px] text-[var(--muted)] font-medium">More in than out</div>
              </div>
              <div className="border border-[var(--border)] rounded-xl p-3 bg-[var(--surface)]">
                <div className="flex items-center gap-2 mb-2 text-[var(--muted)]"><RefreshCw size={14}/> <span className="text-[9px] font-bold uppercase tracking-wider">Avg. Holding Time</span></div>
                <div className="text-[14px] font-black text-[var(--ink)] mb-1">312 days</div>
                <div className="text-[10px] text-[var(--muted)] font-medium">Long-term holder</div>
              </div>
              <div className="border border-[var(--border)] rounded-xl p-3 bg-[var(--surface)]">
                <div className="flex items-center gap-2 mb-2 text-[var(--muted)]"><PieChartIcon size={14}/> <span className="text-[9px] font-bold uppercase tracking-wider">Top Token</span></div>
                <div className="text-[14px] font-black text-[var(--ink)] mb-1">ETH (78.4%)</div>
                <div className="text-[10px] text-[var(--muted)] font-medium">Highest allocation</div>
              </div>
              <div className="border border-[var(--border)] rounded-xl p-3 bg-[var(--surface)]">
                <div className="flex items-center gap-2 mb-2 text-[var(--muted)]"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> <span className="text-[9px] font-bold uppercase tracking-wider">Diversification</span></div>
                <div className="text-[14px] font-black text-[var(--ink)] mb-1">Moderate</div>
                <div className="text-[10px] text-[var(--muted)] font-medium">5+ token types</div>
              </div>
            </div>
          </div>

          <div className="flex-1 border-l border-[var(--border)] pl-6 py-2">
            <div className="text-[11px] font-bold text-[var(--ink)] mb-6">Behavior Breakdown</div>
            <div className="flex flex-col gap-4">
              {[
                { l: 'Holding', p: '72%', c: '#14b8a6', w: '72%' },
                { l: 'Trading', p: '18%', c: '#3b82f6', w: '18%' },
                { l: 'DeFi Usage', p: '7%', c: '#8b5cf6', w: '7%' },
                { l: 'NFT Activity', p: '3%', c: '#ef4444', w: '3%' },
              ].map(b => (
                <div key={b.l} className="flex items-center justify-between">
                  <div className="w-24 text-[11px] font-medium text-[var(--muted)]">{b.l}</div>
                  <div className="flex-1 mx-4 h-2 bg-[var(--bg)] rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: b.w, backgroundColor: b.c }} />
                  </div>
                  <div className="w-8 text-right text-[11px] font-bold text-[var(--ink)]">{b.p}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
      
      {/* APIs Bottom Row */}
      <div className="bg-[var(--surface)] rounded-[24px] shadow-[0_24px_48px_-12px_rgba(15,23,42,0.1)] border border-[var(--border)] p-6 w-[880px] z-10 mx-auto mt-[-10px] relative">
        <HandDrawnAnnotation text={<>Same data.<br/>More understanding.</>} arrow="up-left" className="-bottom-16 -right-12" />
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2 text-[14px] font-black text-[var(--ink)]">
            <div className="w-6 h-6 rounded bg-[#e0e7ff] text-[#6366f1] flex items-center justify-center"><Settings2 size={14}/></div>
            No Extra APIs
          </div>
          <div className="text-[11px] font-bold text-[#6366f1] bg-[#e0e7ff] px-3 py-1 rounded">Simple. Powerful. Complete.</div>
        </div>
        
        <div className="flex items-center justify-between bg-[var(--bg)] rounded-2xl p-6 border border-[var(--border)]">
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-center bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 w-32 shadow-sm">
              <div className="w-10 h-10 bg-[var(--bg)] rounded-full flex items-center justify-center mb-3">
                <svg width="24" height="24" viewBox="0 0 320 512" fill="#334155"><path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"/></svg>
              </div>
              <div className="text-[11px] font-bold text-[var(--ink)]">Ethereum</div>
              <div className="text-[9px] font-medium text-[var(--muted)] mt-0.5">On-chain data</div>
            </div>
            
            <ArrowRightLeft size={16} className="text-[#cbd5e1]" />
            
            <div className="flex flex-col items-center bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 w-32 shadow-sm">
              <div className="w-10 h-10 bg-[var(--ink)] rounded-full flex items-center justify-center mb-3 text-white">
                <Hexagon fill="currentColor" size={20} />
              </div>
              <div className="text-[11px] font-bold text-[var(--ink)]">BlockAction</div>
              <div className="text-[9px] font-medium text-[var(--muted)] mt-0.5 text-center">Unified blockchain data API</div>
            </div>

            <ArrowRightLeft size={16} className="text-[#cbd5e1]" />
            
            <div className="flex flex-col items-center bg-[var(--surface)] border border-[#14b8a6] rounded-xl p-4 w-32 shadow-[0_4px_12px_rgba(20,184,166,0.15)] relative">
              <div className="w-10 h-10 bg-[#ccfbf1] text-[#0f766e] rounded-full flex items-center justify-center mb-3">
                <TrendingUp size={20} strokeWidth={2.5} />
              </div>
              <div className="text-[11px] font-bold text-[var(--ink)]">MyWallet360</div>
              <div className="text-[9px] font-medium text-[#14b8a6] mt-0.5 text-center">Beautiful insights and analytics</div>
            </div>
          </div>
          
          <div className="w-[1px] h-[100px] bg-[#e2e8f0] mx-4" />
          
          <div className="flex flex-col gap-2.5">
            {[
              'No Etherscan Pro',
              'No multiple API keys',
              'No complex setup',
              'All data from BlockAction',
              'Focus on insights, not infrastructure'
            ].map((txt, i) => (
              <div key={i} className="flex items-center gap-2 text-[11px] font-medium text-[var(--muted)]">
                <div className="w-3 h-3 rounded-full bg-[#10b981] flex items-center justify-center text-white"><svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg></div>
                {txt}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
