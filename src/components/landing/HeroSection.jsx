import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { Search, Sun, Moon, ArrowRight, Activity, PieChart, HelpCircle, Wallet, BarChart3, FileText, ArrowLeftRight, TrendingUp, Settings2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const orbitStyles = `
  @keyframes orbit-cw  { from { transform: rotate(0deg);   } to { transform: rotate(360deg);  } }
  @keyframes orbit-ccw { from { transform: rotate(0deg);   } to { transform: rotate(-360deg); } }
  .ring-outer { animation: orbit-cw  60s linear infinite; }
  .ring-mid   { animation: orbit-ccw 40s linear infinite; }
  .ring-inner { animation: orbit-cw  25s linear infinite; }
`

export function HeroSection({
  searchValue,
  onSearchChange,
  onSearchSubmit,
  searchError,
  onSelectExample,
  isLoading,
}) {
  const { user, setAuthModalOpen } = useAuth()
  const containerRef = useRef(null)
  const navRef = useRef(null)
  const leftContentRef = useRef([])
  const rightVisualRef = useRef(null)
  const searchInputRef = useRef(null)

  const [isDarkMode, setIsDarkMode] = useState(() => {
    return document.documentElement.getAttribute('data-theme') === 'dark'
  })

  const toggleTheme = () => {
    setIsDarkMode(prev => {
      const next = !prev
      if (next) {
        document.documentElement.setAttribute('data-theme', 'dark')
      } else {
        document.documentElement.removeAttribute('data-theme')
      }
      return next
    })
  }

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Nav fade down
      gsap.fromTo(navRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
      )

      // Left content stagger up
      gsap.fromTo(leftContentRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.15, delay: 0.2 }
      )

      // Right visual fade/scale in
      gsap.fromTo(rightVisualRef.current,
        { opacity: 0, scale: 0.9, rotation: -5 },
        { opacity: 1, scale: 1, rotation: 0, duration: 1.2, ease: 'power3.out', delay: 0.4 }
      )
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <>
    <style>{orbitStyles}</style>
    <div ref={containerRef} style={{ background: 'var(--bg)', height: '100vh', color: 'var(--ink)', fontFamily: "'Inter', 'DM Sans', system-ui, -apple-system, sans-serif", position: 'relative', display: 'flex', flexDirection: 'column', overflow: 'hidden', transition: 'background-color 0.4s ease' }}>

      {/* Subtle mint glow top-right */}
      <div style={{ position: 'absolute', top: 0, right: 0, width: 700, height: 700, background: 'radial-gradient(ellipse at 70% 30%, rgba(24,197,192,0.07) 0%, transparent 65%)', pointerEvents: 'none', zIndex: 0 }} />

      {/* ─── NAVBAR ─── */}
      <nav ref={navRef} className="w-full max-w-[1320px] mx-auto px-4 sm:px-8 md:px-12 py-3 flex items-center justify-between relative z-10 shrink-0 opacity-0">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-0 no-underline group -ml-2">
          <img src="/images/darklogo.svg" alt="MyWallet360 Logo" className="w-[84px] h-[84px] object-contain transition-transform group-hover:scale-105" />
          <span className="font-extrabold text-[32px] tracking-tight text-[var(--ink)] -ml-2">
            MyWallet<span className="text-[var(--primary)]">360</span>
          </span>
        </Link>

        {/* Center Nav */}
        <div className="hidden lg:flex items-center gap-10">
          {['Features', 'How it works', 'About', 'FAQ'].map(label => (
            <a key={label} href={`#${label.toLowerCase().replace(/\s+/g, '-')}`}
              style={{ fontSize: 14, fontWeight: 500, color: 'var(--muted)', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => e.target.style.color = 'var(--ink)'}
              onMouseLeave={e => e.target.style.color = 'var(--muted)'}
            >{label}</a>
          ))}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          {user ? (
            <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'transparent', border: '1.5px solid var(--border)', padding: '6px 14px', borderRadius: 999, textDecoration: 'none', color: 'var(--ink)', fontWeight: 600, fontSize: 13, transition: 'border-color 0.2s' }}>
              <div style={{ width: 22, height: 22, background: '#18c5c0', borderRadius: '50%', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11 }}>
                {user.email?.[0].toUpperCase() || 'U'}
              </div>
              Profile
            </Link>
          ) : (
            <button onClick={() => setAuthModalOpen(true)} style={{ background: 'transparent', border: 'none', color: 'var(--muted)', fontWeight: 600, fontSize: 14, cursor: 'pointer', padding: '10px', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = 'var(--ink)'} onMouseLeave={e => e.target.style.color = 'var(--muted)'}>
              Sign In
            </button>
          )}

          <button onClick={toggleTheme} style={{ width: 36, height: 36, borderRadius: '50%', border: '1.5px solid transparent', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--muted)', transition: 'background-color 0.4s ease, border-color 0.4s ease' }}>
            {isDarkMode ? <Moon size={17} strokeWidth={1.7} className="text-slate-200" /> : <Sun size={17} strokeWidth={1.7} className="text-amber-500" />}
          </button>
          <button 
            onClick={() => searchInputRef.current?.focus()}
            style={{ background: '#0f172a', color: 'white', border: 'none', borderRadius: 999, padding: '10px 22px', fontWeight: 600, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7, fontFamily: 'inherit' }}
          >
            Analyze a Wallet <ArrowRight size={14} />
          </button>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <main className="w-full max-w-[1320px] mx-auto px-4 sm:px-8 md:px-12 py-6 md:py-8 grid grid-cols-1 lg:grid-cols-[57%_43%] gap-12 lg:gap-0 items-center flex-1 relative z-[1]">

        {/* LEFT */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>

          {/* Eyebrow */}
          <div ref={el => leftContentRef.current[0] = el} style={{ opacity: 0 }}>
            <span className="text-[var(--primary)] font-bold text-[12px] tracking-[0.22em] uppercase mb-5 inline-block">
              Understands every txn
            </span>
          </div>

          {/* Headline */}
          <div ref={el => leftContentRef.current[1] = el} style={{ opacity: 0 }}>
            <h1 className="m-0 mb-5 p-0 leading-[1.03] tracking-[-0.03em] font-black text-[clamp(52px,5.8vw,82px)] font-inherit">
              <span className="text-[var(--ink)] block drop-shadow-sm">Ethereum wallets,</span>
              <span className="text-[var(--muted)] block">made human.</span>
            </h1>
          </div>

          {/* Description */}
          <div ref={el => leftContentRef.current[2] = el} style={{ opacity: 0 }}>
            <p className="m-0 mb-8 text-[17px] font-medium text-[var(--muted)] leading-[1.65] max-w-[500px]">
              Search any Ethereum address or ENS name to see portfolio value, activity,
              transaction history, and on-chain behavior - explained in plain English.
            </p>
          </div>

          {/* Search Bar */}
          <div ref={el => leftContentRef.current[3] = el} style={{ opacity: 0 }}>
            <form
            onSubmit={e => { e.preventDefault(); onSearchSubmit(); }}
            className="flex items-center w-full max-w-[580px] bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] mb-5 h-[64px] overflow-hidden transition-all duration-300 focus-within:border-[var(--primary)] focus-within:shadow-[0_8px_30px_color-mix(in_srgb,var(--primary)_15%,transparent)]"
          >
            <span className="pl-5 text-[var(--muted)] flex items-center flex-shrink-0">
              <Search size={20} strokeWidth={2} />
            </span>
            <input
              ref={searchInputRef}
              type="text"
              value={searchValue}
              onChange={e => onSearchChange(e.target.value)}
              placeholder="Enter Ethereum address or ENS name..."
              className="flex-1 border-none outline-none text-[16px] text-[var(--ink)] font-inherit font-medium px-4 bg-transparent h-full placeholder-[var(--muted)]"
            />
            <button
              type="submit"
              disabled={isLoading}
              className={`bg-[var(--primary)] text-white border-none rounded-xl m-1.5 px-7 font-bold text-[15px] cursor-pointer font-inherit h-[calc(100%-12px)] flex-shrink-0 transition-opacity hover:opacity-90 ${isLoading ? 'opacity-70' : ''}`}
            >
              {isLoading ? 'Analyzing...' : 'Analyze'}
            </button>
            </form>
            {searchError && (
              <div className="text-red-500 text-[14px] mt-1 mb-3 font-semibold">
                {searchError}
              </div>
            )}
          </div>

          {/* Example Tags */}
          <div ref={el => leftContentRef.current[4] = el} style={{ opacity: 0 }}>
            <div className="flex items-center gap-3 flex-wrap">
            <span className="text-[13px] text-[var(--muted)] font-bold">Try an example:</span>
            {[
              ['vitalik.eth', 'vitalik.eth'],
              ['0xd8da...6045', '0xd8da6bf26964af9d7eed9e03e53415d37aa96045'],
              ['a16z.eth', 'a16z.eth'],
            ].map(([label, value]) => (
              <button key={label} type="button" onClick={() => onSelectExample?.(value)}
                className="px-4 py-1.5 rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] text-[13px] font-bold cursor-pointer font-inherit shadow-sm transition-all hover:bg-[var(--bg)] hover:border-[var(--primary)] hover:text-[var(--primary)]"
              >{label}</button>
            ))}
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div ref={rightVisualRef} style={{ position: 'relative', width: '100%', height: 480, display: 'flex', alignItems: 'center', justifyContent: 'center', paddingLeft: 40, opacity: 0 }}>

          {/* Outer ring - slow clockwise */}
          <div className="ring-outer" style={{ position: 'absolute', width: '90%', aspectRatio: '1', borderRadius: '50%', border: '1.5px solid rgba(180,200,210,0.55)', pointerEvents: 'none' }}>
            {/* dot on outer ring */}
            <div style={{ position: 'absolute', top: -4, left: '50%', transform: 'translateX(-50%)', width: 8, height: 8, borderRadius: '50%', background: '#18c5c0', opacity: 0.7 }} />
          </div>

          {/* Mid ring - teal, medium counter-clockwise */}
          <div className="ring-mid" style={{ position: 'absolute', width: '62%', aspectRatio: '1', borderRadius: '50%', border: '2px solid rgba(24,197,192,0.45)', pointerEvents: 'none' }}>
            {/* dot on mid ring */}
            <div style={{ position: 'absolute', bottom: -5, left: '50%', transform: 'translateX(-50%)', width: 9, height: 9, borderRadius: '50%', background: '#18c5c0', opacity: 0.9, boxShadow: '0 0 6px rgba(24,197,192,0.6)' }} />
          </div>

          {/* Inner ring - fast clockwise */}
          <div className="ring-inner" style={{ position: 'absolute', width: '33%', aspectRatio: '1', borderRadius: '50%', border: '1.5px solid rgba(180,200,210,0.45)', pointerEvents: 'none' }}>
            {/* dot on inner ring */}
            <div style={{ position: 'absolute', top: -3, right: -3, width: 6, height: 6, borderRadius: '50%', background: '#18c5c0', opacity: 0.6 }} />
          </div>

          {/* Faceted Wallet Logo */}
          <div style={{ position: 'relative', zIndex: 10, width: 220, height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src="/images/wallet-3d-transparent.png" alt="Wallet 3D" style={{ width: '100%', height: '100%', objectFit: 'contain' }} className="drop-shadow-[0_20px_40px_rgba(24,197,192,0.3)]" />
          </div>

          {/* Floating Pills */}
          {/* Transactions - upper right */}
          <Pill icon={<ArrowLeftRight size={15} strokeWidth={2.5} />} label="Transactions" style={{ top: '6%', right: '0%' }} />
          {/* Portfolio - left mid */}
          <Pill icon={<PieChart size={15} strokeWidth={2.5} />} label="Portfolio" style={{ top: '33%', left: '-2%' }} />
          {/* Insights - right mid */}
          <Pill icon={<BarChart3 size={15} strokeWidth={2.5} />} label="Insights" style={{ bottom: '30%', right: '-4%' }} />
          {/* Activity - lower left */}
          <Pill icon={<Activity size={15} strokeWidth={2.5} />} label="Activity" style={{ bottom: '10%', left: '8%' }} />

          {/* Tagline */}
          <div style={{ position: 'absolute', bottom: '0%', right: '2%', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', zIndex: 20 }}>
            <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--muted)', lineHeight: 1.9, textAlign: 'right' }}>
              Same blockchain.<br />More clarity.
            </span>
            <div style={{ marginTop: 6, height: 2, width: 28, background: '#18c5c0', borderRadius: 2 }} />
          </div>
        </div>
      </main>
    </div>
    </>
  )
}

function Pill({ icon, label, style }) {
  return (
    <div style={{
      position: 'absolute',
      display: 'flex', alignItems: 'center', gap: 8,
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 10,
      padding: '8px 14px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.07)',
      zIndex: 20,
      ...style,
    }}>
      <span style={{ color: '#18c5c0', display: 'flex', alignItems: 'center' }}>{icon}</span>
      <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)', whiteSpace: 'nowrap', fontFamily: "'Inter', 'DM Sans', system-ui, -apple-system, sans-serif" }}>{label}</span>
    </div>
  )
}

function TransparentImage({ src, style }) {
  const canvasRef = useRef(null)
  
  useEffect(() => {
    const img = new Image()
    img.src = src
    img.onload = () => {
      const canvas = canvasRef.current
      if (!canvas) return
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0)
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imageData.data
      
      for (let i = 0; i < data.length; i += 4) {
        // If the pixel is white or very close to white (e.g. anti-aliased edges)
        if (data[i] > 240 && data[i+1] > 240 && data[i+2] > 240) {
          // Calculate how close to white it is (255 is purely white)
          // Simple transparency feathering for edges
          const whiteness = (data[i] + data[i+1] + data[i+2]) / 3
          const alpha = 255 - ((whiteness - 240) * 17) // 240 -> 255 alpha, 255 -> 0 alpha
          data[i+3] = Math.max(0, Math.min(255, alpha))
        }
      }
      ctx.putImageData(imageData, 0, 0)
    }
  }, [src])
  
  return <canvas ref={canvasRef} style={style} />
}
