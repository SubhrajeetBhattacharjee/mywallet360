import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Search, FileText, BarChart3, ArrowRight, Copy, ExternalLink, ChevronDown, Layout, List, PieChart, Activity, TrendingUp, Lock } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const steps = [
  {
    icon: <Search size={28} strokeWidth={1.6} />,
    number: '1.',
    title: 'Enter a wallet or ENS',
    desc: 'Search any Ethereum address or ENS name.',
  },
  {
    icon: <FileText size={28} strokeWidth={1.6} />,
    number: '2.',
    title: 'We analyze the data',
    desc: 'We fetch and process on-chain data from public sources.',
  },
  {
    icon: <BarChart3 size={28} strokeWidth={1.6} />,
    number: '3.',
    title: 'Explore insights',
    desc: 'Get a clear, visual, and easy to understand view.',
  },
]

export function HowItWorksSection() {
  const sectionRef = useRef(null)
  const headerRef = useRef(null)
  const stepsRef = useRef([])
  const arrowRefs = useRef([])
  const mockupRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header fade up
      gsap.fromTo(headerRef.current,
        { opacity: 0, y: 36 },
        {
          opacity: 1, y: 0, duration: 0.85, ease: 'power3.out',
          scrollTrigger: { trigger: headerRef.current, start: 'top 88%', toggleActions: 'play none none none' },
        }
      )

      // Steps stagger in
      gsap.fromTo(stepsRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', stagger: 0.15,
          scrollTrigger: { trigger: stepsRef.current[0], start: 'top 82%', toggleActions: 'play none none none' },
        }
      )

      // Arrows draw in
      gsap.fromTo(arrowRefs.current,
        { opacity: 0, x: -10 },
        {
          opacity: 1, x: 0, duration: 0.5, ease: 'power2.out', stagger: 0.2, delay: 0.3,
          scrollTrigger: { trigger: stepsRef.current[0], start: 'top 82%', toggleActions: 'play none none none' },
        }
      )

      // Mockup slide up
      gsap.fromTo(mockupRef.current,
        { opacity: 0, y: 60, scale: 0.98 },
        {
          opacity: 1, y: 0, scale: 1, duration: 1.0, ease: 'power3.out',
          scrollTrigger: { trigger: mockupRef.current, start: 'top 85%', toggleActions: 'play none none none' },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      style={{
        background: 'transparent',
        padding: '100px 0 110px',
        fontFamily: "'Inter', 'DM Sans', system-ui, -apple-system, sans-serif",
        position: 'relative',
        overflow: 'hidden',
      }}
    >

      <div style={{ maxWidth: 980, margin: '0 auto', padding: '0 48px', position: 'relative', zIndex: 1 }}>

        {/* Section Header */}
        <div ref={headerRef} style={{ textAlign: 'center', marginBottom: 64, opacity: 0 }}>
          <span style={{ display: 'block', color: '#18c5c0', fontWeight: 600, fontSize: 12, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: 18 }}>
            How it works
          </span>
          <h2 style={{ margin: 0, marginBottom: 16, fontWeight: 900, fontSize: 'clamp(34px, 4.5vw, 54px)', letterSpacing: '-0.03em', color: 'var(--ink)', lineHeight: 1.08 }}>
            From address to insights in seconds.
          </h2>
          <p style={{ margin: 0, fontSize: 17, color: 'var(--muted)', fontWeight: 450, lineHeight: 1.6 }}>
            No wallet connection required. Just search and explore.
          </p>
        </div>

        {/* 3-Step Flow */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', gap: 0, marginBottom: 72 }}>
          {steps.map(({ icon, number, title, desc }, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', flex: 1 }}>
              {/* Step */}
              <div
                ref={el => stepsRef.current[i] = el}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', flex: 1, opacity: 0 }}
              >
                {/* Icon circle */}
                <div style={{
                  width: 72, height: 72, borderRadius: '50%',
                  background: 'rgba(24,197,192,0.10)',
                  border: '2px solid rgba(24,197,192,0.25)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#18c5c0',
                  marginBottom: 24,
                }}>
                  {icon}
                </div>
                <h3 style={{ margin: 0, marginBottom: 10, fontWeight: 800, fontSize: 17, color: 'var(--ink)', letterSpacing: '-0.01em', fontFamily: 'inherit' }}>
                  {number} {title}
                </h3>
                <p style={{ margin: 0, fontSize: 14.5, color: 'var(--muted)', lineHeight: 1.6, maxWidth: 200, fontFamily: 'inherit' }}>
                  {desc}
                </p>
              </div>

              {/* Arrow connector */}
              {i < 2 && (
                <div
                  ref={el => arrowRefs.current[i] = el}
                  style={{ display: 'flex', alignItems: 'center', paddingTop: 28, flexShrink: 0, opacity: 0, color: 'var(--muted)', margin: '0 8px' }}
                >
                  <ArrowRight size={22} strokeWidth={1.5} />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Dashboard Mockup */}
        <div style={{ position: 'relative' }}>
          {/* Left annotation */}
          <div style={{ position: 'absolute', left: -80, top: '45%', transform: 'translateY(-50%)', textAlign: 'left', zIndex: 10, pointerEvents: 'none' }}>
            <p style={{ margin: 0, fontFamily: "'Caveat', cursive, sans-serif", fontSize: 18, color: 'var(--muted)', lineHeight: 1.5, fontWeight: 600 }}>
              Clean.<br />Focused.<br />Insightful.
            </p>
            <svg width="60" height="50" viewBox="0 0 60 50" fill="none" style={{ marginTop: 6, marginLeft: 10 }}>
              <path d="M5 5 C10 20, 40 30, 55 45" stroke="#94a3b8" strokeWidth="1.5" fill="none" strokeLinecap="round" markerEnd="url(#arrowhead)" />
              <defs>
                <marker id="arrowhead" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                  <path d="M0,0 L6,3 L0,6 Z" fill="#94a3b8" />
                </marker>
              </defs>
            </svg>
          </div>

          {/* Right annotation */}
          <div style={{ position: 'absolute', right: -80, top: '40%', transform: 'translateY(-50%)', textAlign: 'right', zIndex: 10, pointerEvents: 'none' }}>
            <svg width="60" height="50" viewBox="0 0 60 50" fill="none" style={{ marginBottom: 6, marginRight: 10, transform: 'scaleX(-1)' }}>
              <path d="M5 5 C10 20, 40 30, 55 45" stroke="#94a3b8" strokeWidth="1.5" fill="none" strokeLinecap="round" markerEnd="url(#arrowhead2)" />
              <defs>
                <marker id="arrowhead2" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                  <path d="M0,0 L6,3 L0,6 Z" fill="#94a3b8" />
                </marker>
              </defs>
            </svg>
            <p style={{ margin: 0, fontFamily: "'Caveat', cursive, sans-serif", fontSize: 18, color: 'var(--muted)', lineHeight: 1.5, fontWeight: 600 }}>
              Real data.<br />Real insights.
            </p>
          </div>

          {/* The mockup card */}
          <div
            ref={mockupRef}
            style={{
              background: 'var(--surface)',
              borderRadius: 20,
              border: '1px solid var(--border)',
              boxShadow: '0 20px 80px rgba(0,0,0,0.08), 0 4px 20px rgba(0,0,0,0.04)',
              overflow: 'hidden',
              display: 'flex',
              minHeight: 440,
              opacity: 0,
            }}
          >
            {/* Sidebar */}
            <div style={{ width: 200, background: 'var(--surface)', borderRight: '1px solid var(--border)', padding: '20px 0', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
              {/* Logo */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 16px 20px', borderBottom: '1px solid var(--border)' }}>
                <img src="/images/darklogo.svg" alt="" style={{ width: 28, height: 28 }} />
                <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--ink)' }}>MyWallet<span style={{ color: '#18c5c0' }}>360</span></span>
              </div>

              {/* Nav items */}
              <div style={{ padding: '12px 0', flex: 1 }}>
                {[
                  { icon: <Layout size={15} strokeWidth={1.6} />, label: 'Overview', active: true },
                  { icon: <List size={15} strokeWidth={1.6} />, label: 'Transactions', active: false },
                  { icon: <PieChart size={15} strokeWidth={1.6} />, label: 'Portfolio', active: false },
                  { icon: <BarChart3 size={15} strokeWidth={1.6} />, label: 'Analytics', active: false },
                  { icon: <Activity size={15} strokeWidth={1.6} />, label: 'Insights', active: false },
                ].map(({ icon, label, active }) => (
                  <div key={label} style={{
                    display: 'flex', alignItems: 'center', gap: 9,
                    padding: '8px 16px', margin: '2px 8px',
                    borderRadius: 8,
                    background: active ? 'rgba(24,197,192,0.10)' : 'transparent',
                    color: active ? '#0d6e68' : '#64748b',
                    fontWeight: active ? 600 : 500,
                    fontSize: 13.5,
                    cursor: 'default',
                  }}>
                    {icon}
                    {label}
                  </div>
                ))}
              </div>

              
            </div>

            {/* Main content */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              {/* Search bar */}
              <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
                  <Search size={15} style={{ color: 'var(--muted)', flexShrink: 0 }} strokeWidth={1.5} />
                  <span style={{ fontSize: 13.5, color: 'var(--muted)' }}>Enter address or ENS name...</span>
                </div>
                <ExternalLink size={14} style={{ color: 'var(--muted)' }} />
              </div>

              {/* Wallet header */}
              <div style={{ padding: '16px 20px 12px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}>
                    <svg viewBox="0 0 256 417" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
                      <path fill="#343434" d="M127.961 0l-2.795 9.5v275.668l2.795 2.79 127.962-75.638z" />
                      <path fill="#8C8C8C" d="M127.962 0L0 212.32l127.962 75.639V154.158z" />
                      <path fill="#141414" d="M127.961 287.958l127.96-75.637-127.96-58.162z" />
                      <path fill="#393939" d="M0 212.32l127.96 75.638v-133.8z" />
                    </svg>
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontWeight: 700, fontSize: 15, color: 'var(--ink)' }}>vitalik.eth</span>
                      <Copy size={12} style={{ color: 'var(--muted)' }} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span style={{ fontSize: 12, color: 'var(--muted)' }}>0xd8da6bf26964a...6045</span>
                      <ExternalLink size={11} style={{ color: 'var(--muted)' }} />
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '5px 10px', borderRadius: 6, border: '1px solid var(--border)', cursor: 'default' }}>
                  <span style={{ fontSize: 12.5, color: 'var(--muted)', fontWeight: 500 }}>Last 30 days</span>
                  <ChevronDown size={13} style={{ color: 'var(--muted)' }} />
                </div>
              </div>

              {/* Stats row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', borderBottom: '1px solid var(--border)' }}>
                {[
                  { label: 'Portfolio Value', sub: 'Based on supported tokens' },
                  { label: 'ETH Balance', sub: '-' },
                  { label: 'Wallet Age', sub: 'Since -' },
                  { label: 'Total Transactions', sub: null, link: 'View all →' },
                ].map(({ label, sub, link }, i) => (
                  <div key={i} style={{ padding: '14px 18px', borderRight: i < 3 ? '1px solid var(--border)' : 'none' }}>
                    <div style={{ fontSize: 11.5, color: 'var(--muted)', marginBottom: 6, fontWeight: 500 }}>{label}</div>
                    <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--muted)', marginBottom: 4 }}>-</div>
                    {sub && <div style={{ fontSize: 11, color: 'var(--muted)' }}>{sub}</div>}
                    {link && <div style={{ fontSize: 12, color: '#18c5c0', fontWeight: 600, marginTop: 4, cursor: 'default' }}>{link}</div>}
                  </div>
                ))}
              </div>

              {/* Charts row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', flex: 1, minHeight: 180 }}>
                {/* Portfolio chart */}
                <div style={{ padding: '24px 20px', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                    <span style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--ink)' }}>Portfolio Value</span>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {['7D', '30D', '90D', '1Y', 'ALL'].map((p, i) => (
                        <span key={p} style={{ fontSize: 11, padding: '2px 7px', borderRadius: 4, background: i === 1 ? '#0f172a' : 'transparent', color: i === 1 ? 'white' : '#94a3b8', fontWeight: 600, cursor: 'default' }}>{p}</span>
                      ))}
                    </div>
                  </div>
                  {/* Empty chart state */}
                  <div style={{ flex: 1, minHeight: 120, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--surface)', borderRadius: 8, gap: 6 }}>
                    <Lock size={16} style={{ color: 'var(--muted)' }} strokeWidth={1.5} />
                    <span style={{ fontSize: 12, color: 'var(--muted)' }}>Search a wallet to view data</span>
                  </div>
                </div>

                {/* Token allocation */}
                <div style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--ink)', marginBottom: 20 }}>Token Allocation</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 24, flex: 1 }}>
                    {/* Donut placeholder */}
                    <div style={{ width: 110, height: 110, borderRadius: '50%', border: '14px solid var(--border)', flexShrink: 0 }} />
                    {/* Legend rows */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
                      {[1, 2, 3].map(i => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#e2e8f0', flexShrink: 0 }} />
                          <div style={{ height: 10, borderRadius: 5, background: 'var(--bg)', flex: 1 }} />
                        </div>
                      ))}
                      <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4, lineHeight: 1.4 }}>Search a wallet<br/>to view token allocation</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
